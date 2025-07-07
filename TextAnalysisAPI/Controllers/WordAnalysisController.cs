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
    }
}