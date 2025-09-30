using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Zaza_Gsm_Web.Server.Model;

namespace Zaza_Gsm_Web.Server.Controllers
{
    public class CustomController : ControllerBase
    {
        protected readonly ILogger<Record> _logger;
        protected readonly MySqlConnection SqlConnection;
        public CustomController(ILogger<Record> logger)
        {
            _logger = logger;
            SqlConnection = new MySqlConnection("server=shoppingpro.hu;user=shopping_ClientUser;password=ClientUser12;database=shopping_Zaza_gsm");
        }
    }
}
