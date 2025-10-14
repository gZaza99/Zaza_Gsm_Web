using System.Text.Json.Serialization;
using Zaza_Gsm_Web.Server.Services;
using System.Net;
using System.Net.Sockets;
using Zaza_Gsm_Web.Server.Model;

namespace Zaza_Gsm_Web.Server
{
    class Program
    {
        private static bool PortIsAvailable(int port)
        {
            try
            {
                TcpListener listener = new(IPAddress.Loopback, port);
                listener.Start();
                listener.Stop();
                return true;
            }
            catch (SocketException)
            {
                return false;
            }
        }

#if DEBUG
        private static int[] FreePortsIn(int[] ports)
        {
            int[] freePorts = ports.Where(PortIsAvailable).ToArray();

            return freePorts;
        }
#else
        private static int[] FreePortsIn(int[] ports)
            => ports.Where(PortIsAvailable).ToArray();
#endif

        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            string iniPath = Path.Combine(builder.Environment.ContentRootPath, "settings.ini");
            builder.Configuration.AddIniFile(iniPath, false, true);

            IEnumerable<KeyValuePair<string, string?>> configValues
                = builder.Configuration.AsEnumerable().Where(t => t.Value is not null);

            foreach ((string key, string? value) in configValues)
            {
                switch (key)
                {
                    case "ServerLaunch:HttpPort":
                        Config.ServerLaunch.HttpPort = int.Parse(value!);
                        break;
                    case "ServerLaunch:HttpsPort":
                        Config.ServerLaunch.HttpsPort = int.Parse(value!);
                        break;
                    case "Database:User":
                        Config.Database.User = value!;
                        break;
                    case "Database:Server":
                        Config.Database.Server = value!;
                        break;
                    case "Database:Port":
                        Config.Database.Port = int.Parse(value!);
                        break;
                    case "Database:Password":
                        Config.Database.Password = value!;
                        break;
                    case "Database:Database":
                        Config.Database.DbName = value!;
                        break;
                    case "Database:Timeout":
                        Config.Database.Timeout = int.Parse(value!);
                        break;
                }
            }

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.WithOrigins("https://localhost:5173", // HTTPS-Dev 1
                                       "https://localhost:5174", // HTTPS-Dev 2
                                       "http://localhost:5173" , // HTTP-Dev 1
                                       "http://localhost:5174" , // HTTP-Dev 2
                                       "https://localhost:4173", // HTTPS-Prod 1
                                       "https://localhost:4174", // HTTPS-Prod 2
                                       "http://localhost:4173" , // HTTP-Prod 1
                                       "http://localhost:4174" ) // HTTP-Prod 2
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            int[] ports =
            {
                Config.ServerLaunch.HttpPort,
                Config.ServerLaunch.HttpsPort
            };
            bool portsAreFree = false;
            do
            {
                int[] freePorts = FreePortsIn(ports);
                portsAreFree = freePorts.Contains(ports[0]) && freePorts.Contains(ports[1]);

                if (portsAreFree)
                {
                    // Setting up to HTTP and HTTPS
                    builder.WebHost.ConfigureKestrel(options =>
                    {
                        options.ListenLocalhost(freePorts[0]); // HTTP
                        options.ListenLocalhost(freePorts[1], listenOptions => listenOptions.UseHttps()); // HTTPS
                    });
                }
                else
                {
                    ports[0] += 2;
                    ports[1] += 2;
                }
            } while (!portsAreFree);

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

            app.UseCors("AllowFrontend");

            // The order of middleware is important
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