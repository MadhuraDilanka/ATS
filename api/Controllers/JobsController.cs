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
public class JobsController : ControllerBase
{
    private readonly ATSDbContext _context;

    public JobsController(ATSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobDto>>> GetJobs()
    {
        var jobs = await _context.Jobs
            .Include(j => j.HiringManager)
            .Include(j => j.Applications)
            .Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                Department = j.Department,
                ExperienceLevel = j.ExperienceLevel,
                EmploymentType = j.EmploymentType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                Status = j.Status,
                ClosingDate = j.ClosingDate,
                MaxApplications = j.MaxApplications,
                IsRemoteAllowed = j.IsRemoteAllowed,
                HiringManagerId = j.HiringManagerId,
                HiringManagerName = $"{j.HiringManager.FirstName} {j.HiringManager.LastName}",
                CreatedAt = j.CreatedAt,
                UpdatedAt = j.UpdatedAt,
                ApplicationCount = j.Applications.Count
            })
            .ToListAsync();

        return Ok(jobs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JobDto>> GetJob(int id)
    {
        var job = await _context.Jobs
            .Include(j => j.HiringManager)
            .Include(j => j.Applications)
            .Where(j => j.Id == id)
            .Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                Department = j.Department,
                ExperienceLevel = j.ExperienceLevel,
                EmploymentType = j.EmploymentType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                Status = j.Status,
                ClosingDate = j.ClosingDate,
                MaxApplications = j.MaxApplications,
                IsRemoteAllowed = j.IsRemoteAllowed,
                HiringManagerId = j.HiringManagerId,
                HiringManagerName = $"{j.HiringManager.FirstName} {j.HiringManager.LastName}",
                CreatedAt = j.CreatedAt,
                UpdatedAt = j.UpdatedAt,
                ApplicationCount = j.Applications.Count
            })
            .FirstOrDefaultAsync();

        if (job == null)
        {
            return NotFound();
        }

        return Ok(job);
    }

    [HttpPost]
    public async Task<ActionResult<JobDto>> CreateJob(CreateJobDto createJobDto)
    {
        var job = new Job
        {
            Title = createJobDto.Title,
            Description = createJobDto.Description,
            Requirements = createJobDto.Requirements,
            Location = createJobDto.Location,
            Department = createJobDto.Department,
            ExperienceLevel = createJobDto.ExperienceLevel,
            EmploymentType = createJobDto.EmploymentType,
            SalaryMin = createJobDto.SalaryMin,
            SalaryMax = createJobDto.SalaryMax,
            ClosingDate = createJobDto.ClosingDate,
            MaxApplications = createJobDto.MaxApplications,
            IsRemoteAllowed = createJobDto.IsRemoteAllowed,
            HiringManagerId = createJobDto.HiringManagerId,
            Status = Core.Enums.JobStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, await GetJobDto(job.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(int id, UpdateJobDto updateJobDto)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
        {
            return NotFound();
        }

        job.Title = updateJobDto.Title;
        job.Description = updateJobDto.Description;
        job.Requirements = updateJobDto.Requirements;
        job.Location = updateJobDto.Location;
        job.Department = updateJobDto.Department;
        job.ExperienceLevel = updateJobDto.ExperienceLevel;
        job.EmploymentType = updateJobDto.EmploymentType;
        job.SalaryMin = updateJobDto.SalaryMin;
        job.SalaryMax = updateJobDto.SalaryMax;
        job.Status = updateJobDto.Status;
        job.ClosingDate = updateJobDto.ClosingDate;
        job.MaxApplications = updateJobDto.MaxApplications;
        job.IsRemoteAllowed = updateJobDto.IsRemoteAllowed;
        job.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!JobExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null)
        {
            return NotFound();
        }

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool JobExists(int id)
    {
        return _context.Jobs.Any(e => e.Id == id);
    }

    private async Task<JobDto> GetJobDto(int id)
    {
        return await _context.Jobs
            .Include(j => j.HiringManager)
            .Include(j => j.Applications)
            .Where(j => j.Id == id)
            .Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                Department = j.Department,
                ExperienceLevel = j.ExperienceLevel,
                EmploymentType = j.EmploymentType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                Status = j.Status,
                ClosingDate = j.ClosingDate,
                MaxApplications = j.MaxApplications,
                IsRemoteAllowed = j.IsRemoteAllowed,
                HiringManagerId = j.HiringManagerId,
                HiringManagerName = $"{j.HiringManager.FirstName} {j.HiringManager.LastName}",
                CreatedAt = j.CreatedAt,
                UpdatedAt = j.UpdatedAt,
                ApplicationCount = j.Applications.Count
            })
            .FirstAsync();
    }
}
