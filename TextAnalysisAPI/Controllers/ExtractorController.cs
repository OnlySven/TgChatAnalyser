using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;

namespace TextAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExtractorController : ControllerBase
    {
        [DisableRequestSizeLimit]
        [HttpPost("extractall")]
    public async Task<IActionResult> ExtractAll([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
                return BadRequest("Файл не завантажено");

            string storageFolderPath = "D://code stuff//Sharp//WordAnalyser";
            string baseFileName = Path.GetFileNameWithoutExtension(file.FileName);
            string targetFolder = Path.Combine(storageFolderPath, baseFileName);
            
            if (baseFileName.ToLower() == "result")
            {
                int counter = 1;
                string newFolderName = baseFileName;

                while (Directory.Exists(Path.Combine(storageFolderPath, newFolderName)))
                {
                    newFolderName = $"result{counter}";
                    counter++;
                }

                baseFileName = newFolderName;
                targetFolder = Path.Combine(storageFolderPath, baseFileName);
            }
            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            string messageResultPath = Path.Combine(targetFolder, $"{baseFileName}_messages.json");
            string reactionResultPath = Path.Combine(targetFolder, $"{baseFileName}_reactions.json");
            string receivedReactionResultPath = Path.Combine(targetFolder, $"{baseFileName}_received_reactions.json");
            string wordsResultPath = Path.Combine(targetFolder, $"{baseFileName}_words.json");
            string emojiResultPath = Path.Combine(targetFolder, $"{baseFileName}_emojis.json");

            string json;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                json = await reader.ReadToEndAsync();
            }

            var data = JObject.Parse(json);
            var extractor = new Extractor();

            if (!System.IO.File.Exists(messageResultPath))
            {
                var messages = extractor.ExtractMessages(data);
                SaveJson(messageResultPath, messages);
            }

            if (!System.IO.File.Exists(wordsResultPath))
            {
                var cachedMessages = JsonConvert.DeserializeObject<Dictionary<string, List<DatedMessage>>>(
                    System.IO.File.ReadAllText(messageResultPath)
                );
                var words = extractor.ExtractWords(cachedMessages!);
                SaveJson(wordsResultPath, words);
            }
            if (!System.IO.File.Exists(emojiResultPath))
            {
                var cachedMessages = JsonConvert.DeserializeObject<Dictionary<string, List<DatedMessage>>>(
                    System.IO.File.ReadAllText(messageResultPath)
                );
                var emojis = extractor.ExtractEmojis(cachedMessages!);
                SaveJson(emojiResultPath, emojis);
            }

            if (!System.IO.File.Exists(reactionResultPath))
            {
                var (given, received) = extractor.ExtractReactionsFull(data);
                SaveJson(reactionResultPath, given);
                SaveJson(receivedReactionResultPath, received);
            }

        return Ok(new { folder = baseFileName });
    }
        private void SaveJson<T>(string path, T obj)
        {
            var json = JsonConvert.SerializeObject(obj, Formatting.Indented);
            System.IO.File.WriteAllText(path, json, Encoding.UTF8);
        }
    }
}
