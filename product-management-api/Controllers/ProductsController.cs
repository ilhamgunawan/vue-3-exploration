using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementApi.Data;
using ProductManagementApi.Models;
using ProductManagementApi.Models.Requests;

namespace ProductManagementApi.Controllers;

[ApiController]
[Route("api/products")]
[Consumes("application/json")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private static readonly string[] ValidStatuses = { "active", "inactive", "deleted" };

    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string status = "active")
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var query = _db.Products.Where(p => p.Status == status);

        var totalItems = await query.CountAsync();
        var totalPage = (int)Math.Ceiling((double)totalItems / pageSize);

        var products = await query
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
            })
            .ToListAsync();

        return Ok(new ProductListResponse
        {
            Products = products,
            Pagination = new PaginationInfo
            {
                Page = page,
                PageSize = pageSize,
                TotalPage = totalPage,
                TotalItems = totalItems,
            },
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound(new ErrorResponse("not_found"));
        }

        return Ok(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Status = product.Status,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || !ValidStatuses.Contains(request.Status))
        {
            return BadRequest(new ErrorResponse("invalid_form"));
        }

        var product = new Product
        {
            Name = request.Name,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return Ok(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Status = product.Status,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
        });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await _db.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound(new ErrorResponse("not_found"));
        }

        if (request.Name is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new ErrorResponse("invalid_form"));
            }
            product.Name = request.Name;
        }

        if (request.Status is not null)
        {
            if (!ValidStatuses.Contains(request.Status))
            {
                return BadRequest(new ErrorResponse("invalid_form"));
            }
            product.Status = request.Status;
        }

        if (request.Name is null && request.Status is null)
        {
            return BadRequest(new ErrorResponse("invalid_form"));
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Status = product.Status,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
        });
    }
}

public class ProductResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}

public class ErrorResponse
{
    [JsonPropertyName("error")]
    public ErrorDetail Error { get; set; }

    public ErrorResponse(string code)
    {
        Error = new ErrorDetail { Code = code };
    }
}

public class ErrorDetail
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
}

public class PaginationInfo
{
    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("totalPage")]
    public int TotalPage { get; set; }

    [JsonPropertyName("totalItems")]
    public int TotalItems { get; set; }
}

public class ProductListResponse
{
    [JsonPropertyName("products")]
    public List<ProductResponse> Products { get; set; } = new();

    [JsonPropertyName("pagination")]
    public PaginationInfo Pagination { get; set; } = new();
}
