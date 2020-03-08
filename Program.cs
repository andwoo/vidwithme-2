using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
            return WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((WebHostBuilderContext hostingContext, IConfigurationBuilder config) => ConfigureConfiguration(hostingContext.HostingEnvironment, config))
                .UseStartup<Startup>();
        }

        public static void ConfigureConfiguration(IWebHostEnvironment environment, IConfigurationBuilder config)
        {
            config.SetBasePath(environment.ContentRootPath);
            config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            config.AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
            config.AddJsonFile($"keys.{environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
            config.AddEnvironmentVariables();
        } 
    }
}
