using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using VidWithMe.Hub;

namespace server
{
  public class Startup
  {
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddRazorPages();
      services.AddSignalR();
      services.AddHttpsRedirection(options =>
      {
        options.HttpsPort = 443;
      });
    }

    public void Configure(IConfiguration configuration, IApplicationBuilder app, IWebHostEnvironment environment)
    {
      ConfigureServices(app, environment);

      if (environment.IsDevelopment())
      {
        ConfigureDevelopmentServices(app, environment);
      }
      else
      {
        ConfigureProductionServices(app, environment);
      }
    }

    private void ConfigureDevelopmentServices(IApplicationBuilder app, IWebHostEnvironment environment)
    {
      app.UseHttpsRedirection();
      app.UseDeveloperExceptionPage();
    }

    private void ConfigureProductionServices(IApplicationBuilder app, IWebHostEnvironment environment)
    {
      app.UseHttpsRedirection();
      app.UseExceptionHandler("/Error");
      app.UseHsts();
    }

    private void ConfigureServices(IApplicationBuilder app, IWebHostEnvironment environment)
    {
      app.UseDefaultFiles();
      app.UseStaticFiles();
      app.UseRouting();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapHub<LobbyHub>("/lobby");
        endpoints.MapFallbackToController("Index", "Home");
      });
    }
  }
}
