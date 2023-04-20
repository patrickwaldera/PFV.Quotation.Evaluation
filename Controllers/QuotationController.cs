using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PFV.Quotation.Evaluation.Controllers
{
    public class QuotationController : Controller
    {
        private readonly ILogger<QuotationController> _logger;

        public QuotationController(ILogger<QuotationController> logger)
        {
            _logger = logger;
        }

        [HttpGet()]
        public IActionResult New()
        {
            return View();
        }
    
    }
}
