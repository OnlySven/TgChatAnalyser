using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;

namespace TextAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordAnalysisController : ControllerBase
    {
        [HttpGet("top-unique-words")]
        public IActionResult GetTopUniqueWords([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            TextAnalyser analyser = new TextAnalyser(folder);
            var topUniqueWords = analyser.Top(20);
            return Ok(topUniqueWords);
        }

        [HttpGet("top-filtered-words")]
        public IActionResult GetTopFilteredWords([FromQuery] string folder, [FromQuery] string word)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            if (string.IsNullOrWhiteSpace(word))
                return BadRequest("Не вказано слово для пошуку");

            TextAnalyser analyser = new TextAnalyser(folder);
            var topFilteredWords = analyser.WordStemDetailedFrequency(word);
            return Ok(topFilteredWords);
        }
        [HttpGet("word-frequency-per-user")]
        public IActionResult GetWordFrequencyPerUser([FromQuery] string folder, [FromQuery] string word)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            if (string.IsNullOrWhiteSpace(word))
                return BadRequest("Не вказано слово для пошуку");

            TextAnalyser analyser = new TextAnalyser(folder);
            var wordFrequency = analyser.WordFrequencyPerUser(word);
            return Ok(wordFrequency);
        }
        [HttpGet("top-words-per-user")]
        public IActionResult GetTopWordsPerUser([FromQuery] string folder, [FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Не вказано користувача");

            TextAnalyser analyser = new TextAnalyser(folder);
            var topWords = analyser.Top(username, 20);
            return Ok(topWords);
        }
        [HttpGet("users")]
        public IActionResult GetUsers([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");

            TextAnalyser analyser = new TextAnalyser(folder);
            var users = analyser.GetUsers();
            return Ok(users);
        }
        [HttpGet("total-words-per-user")]
        public IActionResult GetTotalWordsPerUser([FromQuery] string folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return BadRequest("Не вказано папку");

            TextAnalyser analyser = new TextAnalyser(folder);
            var totalWords = analyser.TotalWordsPerUser();
            return Ok(totalWords);
        }
    }
}