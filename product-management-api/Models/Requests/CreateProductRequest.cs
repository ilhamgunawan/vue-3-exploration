using System.Text.Json.Serialization;

namespace ProductManagementApi.Models.Requests;

public class CreateProductRequest
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}
