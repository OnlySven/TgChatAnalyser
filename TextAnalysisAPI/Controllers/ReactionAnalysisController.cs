using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;

namespace TextAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReactionAnalysisController : ControllerBase
    {
        [HttpGet("top-unique-Reactions")]
        public IActionResult GetTopUniqueReactions([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            ReactionAnalyser analyser = new ReactionAnalyser(folder);
            var topUniqueWords = analyser.Top(20);
            return Ok(topUniqueWords);
        }
        [HttpGet("top-reactions-per-user")]
        public IActionResult GetTopReactionsPerUser([FromQuery] string folder, [FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Не вказано користувача");

            ReactionAnalyser analyser = new ReactionAnalyser(folder);
            var topReactions = analyser.Top(username, 20);
            return Ok(topReactions);
        }
    }
}