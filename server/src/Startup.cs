using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace server
{
    public class Startup
    {
        public void Configure(IConfiguration configuration, IApplicationBuilder app, IWebHostEnvironment environment)
        {
            if (environment.IsDevelopment())
            {
                ConfigureDevelopmentServices(app, environment);
            }
            else
            {
                ConfigureProductionServices(app, environment);
            }

            ConfigureServices(app, environment);
        }

        private void ConfigureDevelopmentServices(IApplicationBuilder app, IWebHostEnvironment environment)
        {
            app.UseDeveloperExceptionPage();
        }

        private void ConfigureProductionServices(IApplicationBuilder app, IWebHostEnvironment environment)
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        private void ConfigureServices(IApplicationBuilder app, IWebHostEnvironment environment)
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
