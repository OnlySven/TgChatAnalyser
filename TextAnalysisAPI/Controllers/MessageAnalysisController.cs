using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;

namespace TextAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageAnalysisController : ControllerBase
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
        [HttpGet("activity-per-day")]
        public IActionResult GetActivityPerDay([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            MessageAnalyser analyser = new MessageAnalyser(folder);
            var activityPerDay = analyser.ActivityPerDay();
            return Ok(activityPerDay);
        }
        [HttpGet("messages-per-day")]
        public IActionResult GetMessagesPerDay([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            MessageAnalyser analyser = new MessageAnalyser(folder);
            var messagesPerDay = analyser.MessagesPerDay();
            return Ok(messagesPerDay);
        }
        [HttpGet("messages-per-week")]
        public IActionResult GetMessagesPerWeek([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            MessageAnalyser analyser = new MessageAnalyser(folder);
            var messagesPerWeek = analyser.MessagesPerWeek();
            return Ok(messagesPerWeek);
        }
        [HttpGet("messages-per-month")]
        public IActionResult GetMessagesPerMonth([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            MessageAnalyser analyser = new MessageAnalyser(folder);
            var messagesPerMonth = analyser.MessagesPerMonth();
            return Ok(messagesPerMonth);
        }
    }
}