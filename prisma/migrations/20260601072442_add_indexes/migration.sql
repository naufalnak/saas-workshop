/*
  Warnings:

  - You are about to drop the `rate_limits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "rate_limits";

-- CreateIndex
CREATE INDEX "BookingRequest_workshopId_idx" ON "BookingRequest"("workshopId");

-- CreateIndex
CREATE INDEX "BookingRequest_customerId_idx" ON "BookingRequest"("customerId");

-- CreateIndex
CREATE INDEX "Customer_workshopId_idx" ON "Customer"("workshopId");

-- CreateIndex
CREATE INDEX "Customer_workshopId_email_idx" ON "Customer"("workshopId", "email");

-- CreateIndex
CREATE INDEX "Invoice_workshopId_idx" ON "Invoice"("workshopId");

-- CreateIndex
CREATE INDEX "Invoice_workshopId_status_idx" ON "Invoice"("workshopId", "status");

-- CreateIndex
CREATE INDEX "Order_workshopId_idx" ON "Order"("workshopId");

-- CreateIndex
CREATE INDEX "Order_workshopId_status_idx" ON "Order"("workshopId", "status");

-- CreateIndex
CREATE INDEX "Order_globalCustomerId_idx" ON "Order"("globalCustomerId");

-- CreateIndex
CREATE INDEX "Payment_workshopId_idx" ON "Payment"("workshopId");

-- CreateIndex
CREATE INDEX "Payment_workshopId_paidAt_idx" ON "Payment"("workshopId", "paidAt");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Service_workshopId_idx" ON "Service"("workshopId");

-- CreateIndex
CREATE INDEX "Service_workshopId_status_idx" ON "Service"("workshopId", "status");

-- CreateIndex
CREATE INDEX "Service_vehicleId_idx" ON "Service"("vehicleId");

-- CreateIndex
CREATE INDEX "Service_mechanicId_idx" ON "Service"("mechanicId");

-- CreateIndex
CREATE INDEX "ServiceItem_serviceId_idx" ON "ServiceItem"("serviceId");

-- CreateIndex
CREATE INDEX "User_workshopId_idx" ON "User"("workshopId");

-- CreateIndex
CREATE INDEX "Vehicle_workshopId_idx" ON "Vehicle"("workshopId");

-- CreateIndex
CREATE INDEX "Vehicle_customerId_idx" ON "Vehicle"("customerId");

-- CreateIndex
CREATE INDEX "Workshop_isPublished_idx" ON "Workshop"("isPublished");

-- CreateIndex
CREATE INDEX "WorkshopService_workshopId_idx" ON "WorkshopService"("workshopId");
