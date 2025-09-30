using Microsoft.AspNetCore.Mvc;
using Zaza_Gsm_Web.Server.Model;
using MySqlConnector;

namespace Zaza_Gsm_Web.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientController : CustomController
    {
        public ClientController(ILogger<Client> logger) : base(logger)
        {
        }

        [HttpGet]
        public IEnumerable<Client> Get()
        {
            IEnumerable<Client> clients = [];

            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new("CALL `GetClients`()", SqlConnection);
                MySqlDataReader reader = cmd.ExecuteReader();
                Client newClient;
                while (reader.Read())
                {
                    // The order of the attributes defined in the stored procedure
#if DEBUG
                    newClient = new Client();
                    newClient.Id = (long)reader[0];
                    newClient.FullName = reader[1].ToString();
                    newClient.PhoneNumber = reader[2].ToString();
                    newClient.Email = reader[3] == DBNull.Value ? null : reader[3].ToString();
                    newClient.Address = reader[4] == DBNull.Value ? null : reader[4].ToString();
#else
                    newClient = new Client
                    {
                        Id = (long)reader[0],
                        FullName = reader[1].ToString(),
                        PhoneNumber = reader[2].ToString(),
                        Email = reader[3] == DBNull.Value ? null : reader[3].ToString(),
                        Address = reader[4] == DBNull.Value ? null : reader[4].ToString()
                    };
#endif
                    clients = clients.Append(newClient);
                }

                SqlConnection.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
            }

            return clients;
        }

        [HttpGet("{id:long}")]
        public Client? Get(long id)
        {
            Client? client = null;
            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new($"CALL `GetClientById`({id})", SqlConnection);
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    // The order of the attributes defined in the stored procedure
#if DEBUG
                    client = new Client();
                    client.Id = (long)reader[0];
                    client.FullName = reader[1].ToString();
                    client.PhoneNumber = reader[2].ToString();
                    client.Email = reader[3] == DBNull.Value ? null : reader[3].ToString();
                    client.Address = reader[4] == DBNull.Value ? null : reader[4].ToString();
#else
                    client = new Client
                    {
                        Id = (long)reader[0],
                        FullName = reader[1].ToString(),
                        PhoneNumber = reader[2].ToString(),
                        Email = reader[3] == DBNull.Value ? null : reader[3].ToString(),
                        Address = reader[4] == DBNull.Value ? null : reader[4].ToString()
                    };
#endif
                }

                SqlConnection.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError("Database connection error: " + ex.Message);
            }
            return client;
        }

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

        /// <summary>Deletes a client from the database by ID, and returns true if successful, false otherwise.</summary>
        [HttpDelete]
        public bool Delete(long id)
        {
            bool success;
            try
            {
                SqlConnection.Open();

                MySqlCommand cmd = new($"CALL `DeleteClient`({id})", SqlConnection);
                success = (long)cmd.ExecuteScalar()! == 1 ? true : false;

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
