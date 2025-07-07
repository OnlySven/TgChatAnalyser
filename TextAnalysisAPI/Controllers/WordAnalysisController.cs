using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;

namespace TextAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordAnalysisController : ControllerBase
    {
        [HttpGet("activity-per-hour")]
        public IActionResult GetActivityPerHour([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            MessageAnalyser analyser = new MessageAnalyser(folder);
            var activityPerHour = analyser.ActivityPerHour();
            return Ok(activityPerHour);
        }
    }
}