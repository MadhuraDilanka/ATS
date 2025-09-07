using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Data;
using api.Application.DTOs;
using api.Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CandidatesController : ControllerBase
{
    private readonly ATSDbContext _context;

    public CandidatesController(ATSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CandidateDto>>> GetCandidates()
    {
        var candidates = await _context.Candidates
            .Include(c => c.Applications)
            .Include(c => c.CandidateSkills)
                .ThenInclude(cs => cs.Skill)
            .Select(c => new CandidateDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Address = c.Address,
                LinkedInProfile = c.LinkedInProfile,
                GitHubProfile = c.GitHubProfile,
                Portfolio = c.Portfolio,
                Summary = c.Summary,
                YearsOfExperience = c.YearsOfExperience,
                CurrentJobTitle = c.CurrentJobTitle,
                CurrentCompany = c.CurrentCompany,
                ExpectedSalary = c.ExpectedSalary,
                IsAvailable = c.IsAvailable,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ApplicationCount = c.Applications.Count,
                Skills = c.CandidateSkills.Select(cs => cs.Skill.Name).ToList()
            })
            .ToListAsync();

        return Ok(candidates);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CandidateDto>> GetCandidate(int id)
    {
        var candidate = await _context.Candidates
            .Include(c => c.Applications)
            .Include(c => c.CandidateSkills)
                .ThenInclude(cs => cs.Skill)
            .Where(c => c.Id == id)
            .Select(c => new CandidateDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Address = c.Address,
                LinkedInProfile = c.LinkedInProfile,
                GitHubProfile = c.GitHubProfile,
                Portfolio = c.Portfolio,
                Summary = c.Summary,
                YearsOfExperience = c.YearsOfExperience,
                CurrentJobTitle = c.CurrentJobTitle,
                CurrentCompany = c.CurrentCompany,
                ExpectedSalary = c.ExpectedSalary,
                IsAvailable = c.IsAvailable,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ApplicationCount = c.Applications.Count,
                Skills = c.CandidateSkills.Select(cs => cs.Skill.Name).ToList()
            })
            .FirstOrDefaultAsync();

        if (candidate == null)
        {
            return NotFound();
        }

        return Ok(candidate);
    }

    [HttpPost]
    public async Task<ActionResult<CandidateDto>> CreateCandidate(CreateCandidateDto createCandidateDto)
    {
        var candidate = new Candidate
        {
            FirstName = createCandidateDto.FirstName,
            LastName = createCandidateDto.LastName,
            Email = createCandidateDto.Email,
            PhoneNumber = createCandidateDto.PhoneNumber,
            Address = createCandidateDto.Address,
            LinkedInProfile = createCandidateDto.LinkedInProfile,
            GitHubProfile = createCandidateDto.GitHubProfile,
            Portfolio = createCandidateDto.Portfolio,
            Summary = createCandidateDto.Summary,
            YearsOfExperience = createCandidateDto.YearsOfExperience,
            CurrentJobTitle = createCandidateDto.CurrentJobTitle,
            CurrentCompany = createCandidateDto.CurrentCompany,
            ExpectedSalary = createCandidateDto.ExpectedSalary,
            IsAvailable = createCandidateDto.IsAvailable,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCandidate), new { id = candidate.Id }, await GetCandidateDto(candidate.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCandidate(int id, UpdateCandidateDto updateCandidateDto)
    {
        var candidate = await _context.Candidates.FindAsync(id);

        if (candidate == null)
        {
            return NotFound();
        }

        candidate.FirstName = updateCandidateDto.FirstName;
        candidate.LastName = updateCandidateDto.LastName;
        candidate.Email = updateCandidateDto.Email;
        candidate.PhoneNumber = updateCandidateDto.PhoneNumber;
        candidate.Address = updateCandidateDto.Address;
        candidate.LinkedInProfile = updateCandidateDto.LinkedInProfile;
        candidate.GitHubProfile = updateCandidateDto.GitHubProfile;
        candidate.Portfolio = updateCandidateDto.Portfolio;
        candidate.Summary = updateCandidateDto.Summary;
        candidate.YearsOfExperience = updateCandidateDto.YearsOfExperience;
        candidate.CurrentJobTitle = updateCandidateDto.CurrentJobTitle;
        candidate.CurrentCompany = updateCandidateDto.CurrentCompany;
        candidate.ExpectedSalary = updateCandidateDto.ExpectedSalary;
        candidate.IsAvailable = updateCandidateDto.IsAvailable;
        candidate.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CandidateExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCandidate(int id)
    {
        var candidate = await _context.Candidates.FindAsync(id);
        if (candidate == null)
        {
            return NotFound();
        }

        _context.Candidates.Remove(candidate);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CandidateExists(int id)
    {
        return _context.Candidates.Any(e => e.Id == id);
    }

    private async Task<CandidateDto> GetCandidateDto(int id)
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .Include(c => c.CandidateSkills)
                .ThenInclude(cs => cs.Skill)
            .Where(c => c.Id == id)
            .Select(c => new CandidateDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Address = c.Address,
                LinkedInProfile = c.LinkedInProfile,
                GitHubProfile = c.GitHubProfile,
                Portfolio = c.Portfolio,
                Summary = c.Summary,
                YearsOfExperience = c.YearsOfExperience,
                CurrentJobTitle = c.CurrentJobTitle,
                CurrentCompany = c.CurrentCompany,
                ExpectedSalary = c.ExpectedSalary,
                IsAvailable = c.IsAvailable,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ApplicationCount = c.Applications.Count,
                Skills = c.CandidateSkills.Select(cs => cs.Skill.Name).ToList()
            })
            .FirstAsync();
    }
}
