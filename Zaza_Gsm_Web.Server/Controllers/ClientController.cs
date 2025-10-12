using Microsoft.AspNetCore.Mvc;
using Zaza_Gsm_Web.Server.Model;
using MySqlConnector;

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
        public IEnumerable<Client> Get()
            => _cache.GetClients();

        [HttpGet("{id:long}")]
        public Client? Get(long id)
            => _cache.GetClients().FirstOrDefault(temp_client => temp_client.Id == id);

        /// <summary>Saves a new client to the database and returns the new client's ID.</summary>
        [HttpPost]
        public long Post(string fullName, string phoneNumber, string? email, string? address)
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                newId = -1;
            }
            return newId;
        }

        [HttpPut]
        public bool Put(long id, string fullName, string phoneNumber, string? email, string? address)
        {
            bool success;
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client update failed.");
            }
            return success;
        }

        [HttpPatch("full_name")]
        public bool SetName(long id, string fullName)
        {
            bool success;
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client name update failed.");
            }
            return success;
        }

        [HttpPatch("phone_number")]
        public bool SetPhoneNumber(long id, string phoneNumber)
        {
            bool success;
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client phone number update failed.");
            }
            return success;
        }

        [HttpPatch("email")]
        public bool SetEmail(long id, string? email)
        {
            bool success;
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client email update failed.");
            }
            return success;
        }

        [HttpPatch("address")]
        public bool SetAddress(long id, string? address)
        {
            bool success;
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
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client address update failed.");
            }
            return success;
        }

        /// <summary>Deletes a client from the database by ID, and returns true if successful, false otherwise.</summary>
        [HttpDelete]
        public bool Delete(long id)
        {
            bool success;
            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new($"CALL `DeleteClient`({id})", SqlConnection);
                success = (long)cmd.ExecuteScalar()! == 1;

                SqlConnection.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
                success = false;
            }
            if (!success)
            {
                _logger.LogError("Client deletion failed.");
            }
            return success;
        }
    }
}
