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
            var topUniqueWords = analyser.Top(15);
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
            var topReactions = analyser.Top(username, 15);
            return Ok(topReactions);
        }
        [HttpGet("top-given-reactions-per-user")]
        public IActionResult GetTopGivenReactionsPerUser([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            ReactionAnalyser analyser = new ReactionAnalyser(folder);
            var topUniqueWords = analyser.TotalItemsPerUser();
            return Ok(topUniqueWords);
        }
        [HttpGet("top-received-reactions-per-user")]
        public IActionResult GetTopReceivedReactionsPerUser([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");

            BaseAnalyser analyser = new BaseAnalyser(new Extractor().GetWords(
                $"D://code stuff//Sharp//WordAnalyser//{folder}",
                $"{folder}_received_reactions.json"));
            var topReactions = analyser.TotalItemsPerUser();
            return Ok(topReactions);
        }
        [HttpGet("top-unique-emojis")]
        public IActionResult GetTopUniqueEmojis([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            EmojiAnalyser analyser = new EmojiAnalyser(folder);
            var topUniqueWords = analyser.Top(15);
            return Ok(topUniqueWords);
        }
        [HttpGet("top-emojis-per-user")]
        public IActionResult GetTopEmojisPerUser([FromQuery] string folder, [FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Не вказано користувача");

            EmojiAnalyser analyser = new EmojiAnalyser(folder);
            var topEmojis = analyser.Top(username, 15);
            return Ok(topEmojis);
        }
        
    }
}