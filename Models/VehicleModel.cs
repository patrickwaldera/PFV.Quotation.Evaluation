namespace PFV.Api.QuotationClient.Models.Results
{
    public class VehicleModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int VehicleTypeId { get; set; }
        public string VehicleType { get; set; }
        public string FipeCode { get; set; }
        public string FipePrice { get; set; }
        public bool Restriction { get; set; }
    }
}
