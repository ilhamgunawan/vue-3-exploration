using System.Text.Json.Serialization;

namespace ProductManagementApi.Models.Requests;

public class UpdateProductRequest
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }
}
