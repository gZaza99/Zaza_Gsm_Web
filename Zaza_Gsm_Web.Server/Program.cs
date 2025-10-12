using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
namespace Zaza_Gsm_Web.Server
{
    class Program
    {
        private static int[] FreePortIn(int[] ports)
        {
            int[] freePorts = ports.Where(p =>
            {
                try
                {
                    // Ellen�rizz�k, hogy a port szabad-e
                    using var listener = new System.Net.Sockets.TcpListener(System.Net.IPAddress.Loopback, p);
                    listener.Start();
                    listener.Stop();
                    return true;
                }
                catch
                {
                    return false;
                }
            }).ToArray();

            return freePorts;
        }

        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            // INI konfigur�ci� bet�lt�se (settings.ini)
            builder.Configuration
                .SetBasePath(AppContext.BaseDirectory)
                .AddIniFile("settings.ini", optional: true, reloadOnChange: true);

            IConfigurationSection config = builder.Configuration.GetSection("Server");

            // Port beolvas�sa a konfigur�ci�b�l
            string portSetting = config["Port"] ?? "5000";
            int[] ports = portSetting
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(p => int.Parse(p))
                .ToArray();

            ports = FreePortIn(ports);

            builder.WebHost.UseUrls(ports.Select(p => $"http://localhost:{p}").ToArray());

            // CORS POLICY REGISZTR�L�SA
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.WithOrigins("http://localhost:5173", "https://localhost:7105", "http://localhost:5114")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            // Add services to the container.
            builder.Services.AddControllers()
                // Allow convertion between Backend BIGINT and FrontEnd BigInt
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register hosted service
            builder.Services.AddSingleton<DbCacheManager>();
            builder.Services.AddHostedService(provider => provider.GetRequiredService<DbCacheManager>());

            WebApplication app = builder.Build();

            // CORS ENGED�LYEZ�SE
            app.UseCors("AllowFrontend");

            // A t�bbi middleware sorrend fontos:
            app.UseRouting();
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}