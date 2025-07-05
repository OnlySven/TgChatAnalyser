using Microsoft.AspNetCore.Mvc;
using TextAnalysisLib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

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
        Directory.CreateDirectory(targetFolder);

        string messageResultPath = Path.Combine(targetFolder, $"{baseFileName}_messages.json");
        string reactionResultPath = Path.Combine(targetFolder, $"{baseFileName}_reactions.json");
        string wordsResultPath = Path.Combine(targetFolder, $"{baseFileName}_words.json");

        string json;
        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            json = await reader.ReadToEndAsync();
        }

        var data = JObject.Parse(json); // ❗️ Тут може впасти, якщо JSON пошкоджений
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

    if (!System.IO.File.Exists(reactionResultPath))
    {
        var reactions = extractor.ExtractReactions(data);
        SaveJson(reactionResultPath, reactions);
    }

    return Ok(new { folder = baseFileName });    
}

        private void SaveJson<T>(string path, T obj)
        {
            var json = JsonConvert.SerializeObject(obj, Formatting.Indented);
            System.IO.File.WriteAllText(path, json);
        }
    }
}
