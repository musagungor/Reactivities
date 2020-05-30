import { toast } from 'react-toastify';
import { IProfile, IPhoto } from './../models/profile';
import { RootStore } from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import agent from '../api/agent';
export default class ProfileStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )

    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action setActiveTab = (aciveIndex: number) => {
        this.activeTab = aciveIndex;
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction('Getting Profile', () => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            runInAction('Getting Profile error', () => {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction('Uploading Photos', () => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem on uploading photo')
            runInAction('Uploading Photos error', () => {
                this.uploadingPhoto = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction('setting main photo', () => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(p => p.isMain)!.isMain = false;
                this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })

        } catch (error) {
            toast.error('Problem setting photo as main');

            runInAction('setting main photo error', () => {
                this.loading = false;
            })

        }
    }


    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction('deleting photo', () => {
                this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id)
                this.loading = false;
            })

        } catch (error) {
            toast.error('Problem deleting the photo ');

            runInAction('deleting photo error', () => {
                this.loading = false;
            })

        }
    }

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction('following user ', () => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            })

        } catch (error) {
            toast.error('Problem following user')
            runInAction('following user error', () => {
                this.loading = false;
            })

        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction('following user ', () => {
                this.profile!.following = true;
                this.profile!.followersCount--;
                this.loading = false;
            })

        } catch (error) {
            toast.error('Problem unfollowing user')
            runInAction('unfollowing user error', () => {
                this.loading = false;
            })

        }
    }


    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction('listing followings', () => {
                this.followings = profiles;
                this.loading = false;
            })

        } catch (error) {
            toast.error('Problem loading followings')
            runInAction('listing followings error', () => {
                this.loading = false;
            })

        }
    }
}