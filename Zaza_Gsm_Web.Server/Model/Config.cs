namespace Zaza_Gsm_Web.Server.Model
{
    public static class Config
    {
        // Default settings in case there is no INI file.
        public static class ServerLaunch
        {
            public static int HttpPort = 5000;
            public static int HttpsPort = 5001;
        }
        public static class Database
        {
            public static string Server = "ServerUrl";
            public static string DbName = "MyDatabase";
            public static string User = "User";
            public static string Password = "password";
            public static int Port = 3306;
            /// <summary>Seconds</summary>
            public static int Timeout = 10;

            public static string GetConnectionString()
                => $"server={Server};user={User};password={Password};database={DbName};port={Port};default command timeout={Timeout};";
        }
    }
}
