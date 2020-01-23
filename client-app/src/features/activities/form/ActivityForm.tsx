import React from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'

interface IProps {
    setEditMode : (editMode:boolean)=>void;
}

export const ActivityForm : React.FC<IProps> = ({setEditMode}) => {
    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder='Title' />
                <Form.TextArea placeholder='Description' />
                <Form.Input placeholder='Category' />
                <Form.Input type='date' placeholder='Date' />
                <Form.Input placeholder='City' />
                <Form.Input placeholder='Venue' />
                <Button floated='right' positive content='Submit' type='submit' ></Button>
                <Button onClick={()=>setEditMode(false)} floated='right' content='Cancel' type='button'  ></Button>
            </Form>
        </Segment>
    )
}
