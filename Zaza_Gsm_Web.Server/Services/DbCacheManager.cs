using MySqlConnector;
using System.Collections.Concurrent;
using Zaza_Gsm_Web.Server.Model;

namespace Zaza_Gsm_Web.Server.Services
{
    // Primary constructor: DbCacheManager(ILogger<DbCacheManager> logger)
    public class DbCacheManager(ILogger<DbCacheManager> logger) : IHostedService, IDisposable
    {
        private readonly ILogger<DbCacheManager> _logger = logger;
        private readonly MySqlConnection _connection = new(Config.Database.GetConnectionString());
        private readonly ConcurrentDictionary<string, object> _cache = new();
        private Timer? _timer;
        private string? _lastClientHash;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("DatabaseCacheManager started.");
            LoadClients();
            _timer = new Timer(CheckForUpdates, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));
            return Task.CompletedTask;
        }

        private void CheckForUpdates(object? state)
        {
            try
            {
                MySqlCommand cmd = new("CALL `GetClientsState`();", _connection);

                _connection.Open();
                string currentHash = (string)cmd.ExecuteScalar()!;
                _connection.Close();

                if (_lastClientHash != currentHash)
                {
                    _logger.LogDebug("Változás észlelve a 'clients' táblában, újratöltés...");
                    LoadClients();
                    _lastClientHash = currentHash;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hiba történt a hash ellenőrzése során.");
            }
        }

        private void LoadClients()
        {
            var clients = new List<Client>();

            MySqlCommand cmd = new("CALL `GetClients`();", _connection);
            _connection.Open();

            MySqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                clients.Add(new Client
                {
                    Id = reader.GetInt64("client_id"),
                    FullName = reader.GetString("full_name"),
                    PhoneNumber = reader.GetString("phone_number"),
                    Email = reader["email"] as string,
                    Address = reader["address"] as string
                });
            }

            reader.Close();
            _connection.Close();

            _cache["clients"] = clients;
            _logger.LogDebug($"Clients cache frissítve, {clients.Count} rekord betöltve.");
        }

        public List<Client> GetClients() =>
            _cache.TryGetValue("clients", out object? data) ? (List<Client>)data : [];

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("DatabaseCacheManager stopped.");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
            _connection.Dispose();
        }
    }
}