using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MySqlConnector;
using System.Diagnostics;
using Zaza_Gsm_Web.Server.Model;
using Zaza_Gsm_Web.Server.Services;

namespace Zaza_Gsm_Web.Server.Controllers
{
    public class CustomController : Controller
    {
        protected readonly ILogger<Record> _logger;
        protected readonly MySqlConnection SqlConnection;
        protected readonly DbCacheManager _cache;

        public CustomController(ILogger<Record> logger, DbCacheManager cache)
        {
            _logger = logger;
            _cache = cache;
            SqlConnection = new MySqlConnection(Config.Database.GetConnectionString());
        }

    }
}
