using Microsoft.AspNetCore.Mvc;
using Zaza_Gsm_Web.Server.Model;
using MySqlConnector;
using Zaza_Gsm_Web.Server.Services;

namespace Zaza_Gsm_Web.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientController : CustomController
    {
        public ClientController(ILogger<Client> logger, DbCacheManager _cache) : base(logger, _cache)
        {
        }

        [HttpGet]
        public async Task<List<Client>> Get()
            => await Task.Run(() => _cache.GetClients());

        [HttpGet("{id:long}")]
        public async Task<Client?> Get(long id)
            => await Task.Run(() => _cache.GetClients().FirstOrDefault(temp_client => temp_client.Id == id));

        [HttpPost]
        public async Task<long> Post(string fullName, string phoneNumber, string? email, string? address)
        {
            long newId;
            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new($"CALL `AddClient`('{fullName}', '{phoneNumber}', " +
                    $"{(email == null ? "NULL" : $"'{email}'")}, " +
                    $"{(address == null ? "NULL" : $"'{address}'")});", SqlConnection);
                newId = (long)cmd.ExecuteScalar()!;

                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                newId = -1;
            }
            return await Task.FromResult(newId);
        }

        [HttpPut]
        public async Task<bool> Put(long id, string fullName, string phoneNumber, string? email, string? address)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();
                MySqlCommand cmd = new($"CALL `UpdateClient`({id}, '{fullName}', '{phoneNumber}', " +
                    $"{(email == null ? "NULL" : $"'{email}'")}, " +
                    $"{(address == null ? "NULL" : $"'{address}'")});", SqlConnection);
#if DEBUG
                long e = (long)cmd.ExecuteScalar()!;
                success = e == 1;
#else
                success = (long)cmd.ExecuteScalar()! == 1;
#endif
                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
                _logger.LogError("Client update failed:" + errorMessage);

            return await Task.FromResult(success);
        }

        [HttpPatch("full_name")]
        public async Task<bool> SetName(long id, string fullName)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();
                MySqlCommand cmd = new($"CALL `PatchClientName`({id}, '{fullName}');", SqlConnection);
#if DEBUG
                long e = (long)cmd.ExecuteScalar()!;
                success = e == 1;
#else
                success = (long)cmd.ExecuteScalar()! == 1;
#endif
                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client name update failed: " + errorMessage);
            }
            return await Task.FromResult(success);
        }

        [HttpPatch("phone_number")]
        public async Task<bool> SetPhoneNumber(long id, string phoneNumber)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();
                MySqlCommand cmd = new($"CALL `PatchClientPhoneNumber`({id}, '{phoneNumber}');", SqlConnection);
#if DEBUG
                long e = (long)cmd.ExecuteScalar()!;
                success = e == 1;
#else
                success = (long)cmd.ExecuteScalar()! == 1;
#endif
                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client phone number update failed: " + errorMessage);
            }
            return await Task.FromResult(success);
        }

        [HttpPatch("email")]
        public async Task<bool> SetEmail(long id, string? email)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();
                MySqlCommand cmd = new($"CALL `PatchClientEmail`({id}, " +
                    $"{(email == null ? "NULL" : $"'{email}'")});", SqlConnection);
#if DEBUG
                long e = (long)cmd.ExecuteScalar()!;
                success = e == 1;
#else
                success = (long)cmd.ExecuteScalar()! == 1;
#endif
                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client email update failed: " + errorMessage);
            }
            return await Task.FromResult(success);
        }

        [HttpPatch("address")]
        public async Task<bool> SetAddress(long id, string? address)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();
                MySqlCommand cmd = new($"CALL `PatchClientAddress`({id}, " +
                    $"{(address == null ? "NULL" : $"'{address}'")});", SqlConnection);
#if DEBUG
                long e = (long)cmd.ExecuteScalar()!;
                success = e == 1;
#else
                success = (long)cmd.ExecuteScalar()! == 1;
#endif
                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client address update failed: " + errorMessage);
            }
            return await Task.FromResult(success);
        }

        [HttpDelete]
        public async Task<bool> Delete(long id)
        {
            bool success;
            string errorMessage = string.Empty;
            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new($"CALL `DeleteClient`({id})", SqlConnection);
                success = (long)cmd.ExecuteScalar()! == 1;

                SqlConnection.Close();
                _cache.InvalidateClientsCache();
            }
            catch (Exception ex)
            {
                errorMessage += "Database connection error: " + ex.Message;
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client deletion failed: " + errorMessage);
            }
            return await Task.FromResult(success);
        }
    }
}
