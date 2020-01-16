using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;

        public ValuesController(DataContext context)
        {
            this._context = context;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> GetAsync()
        {
            var values = await _context.Values.ToListAsync();

            return Ok(values);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> GetAsync(int id)        {
            var value = await _context.Values.FindAsync(id);
            return  Ok(value);
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {

        }

    }
}