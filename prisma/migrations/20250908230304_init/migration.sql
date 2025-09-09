-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CC_OPERATOR', 'FIELD_RESPONDER', 'DISPATCHER', 'SUPERVISOR', 'TRAINER');

-- CreateEnum
CREATE TYPE "public"."PersonnelStatus" AS ENUM ('ON_DUTY', 'OFF_DUTY', 'EN_ROUTE', 'ON_SCENE', 'UNAVAILABLE', 'ON_LEAVE', 'TRAINING');

-- CreateEnum
CREATE TYPE "public"."VehicleType" AS ENUM ('ENGINE', 'LADDER', 'RESCUE', 'AMBULANCE', 'HAZMAT', 'COMMAND', 'TANKER', 'BRUSH', 'UTILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('IN_SERVICE', 'OUT_OF_SERVICE', 'EN_ROUTE', 'ON_SCENE', 'MAINTENANCE', 'RESERVE');

-- CreateEnum
CREATE TYPE "public"."HydrantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DAMAGED', 'UNKNOWN', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "public"."HydrantType" AS ENUM ('DRY_BARREL', 'WET_BARREL', 'WALL_HYDRANT', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."EquipmentType" AS ENUM ('BREATHING_APPARATUS', 'HOSE', 'NOZZLE', 'LADDER', 'TOOLS', 'COMMUNICATION', 'MEDICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EquipmentStatus" AS ENUM ('IN_SERVICE', 'OUT_OF_SERVICE', 'MAINTENANCE', 'RESERVE');

-- CreateEnum
CREATE TYPE "public"."MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'INSPECTION');

-- CreateEnum
CREATE TYPE "public"."IncidentType" AS ENUM ('FIRE', 'MEDICAL', 'RESCUE', 'HAZMAT', 'FALSE_ALARM', 'SERVICE_CALL', 'TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."IncidentStatus" AS ENUM ('ACTIVE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'CONTAINED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EvidenceType" AS ENUM ('PHOTO', 'VIDEO', 'DOCUMENT', 'AUDIO', 'WITNESS_STATEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AssignmentRole" AS ENUM ('COMMAND', 'FIREFIGHTER', 'PARAMEDIC', 'DRIVER', 'OBSERVER', 'SUPPORT', 'INVESTIGATOR', 'SAFETY_OFFICER');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INCIDENT_DISPATCH', 'INCIDENT_UPDATE', 'ASSIGNMENT', 'SYSTEM_ALERT', 'MAINTENANCE_REMINDER', 'TRAINING_REMINDER', 'GENERAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('INCIDENT_SUMMARY', 'MONTHLY_REPORT', 'ANNUAL_REPORT', 'PERFORMANCE_REPORT', 'MAINTENANCE_REPORT', 'TRAINING_REPORT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'FIELD_RESPONDER',
    "badgeNumber" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "preferences" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."personnel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "rank" TEXT,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hireDate" TIMESTAMP(3),
    "stationId" TEXT,
    "status" "public"."PersonnelStatus" NOT NULL DEFAULT 'OFF_DUTY',
    "currentAssignment" TEXT,
    "emergencyContact" TEXT,
    "medicalInfo" TEXT,
    "trainingHours" INTEGER NOT NULL DEFAULT 0,
    "performanceScore" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_records" (
    "id" TEXT NOT NULL,
    "personnelId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "score" DOUBLE PRECISION,
    "certificate" TEXT,
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "training_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."performance_reviews" (
    "id" TEXT NOT NULL,
    "personnelId" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "reviewedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "coverage" DOUBLE PRECISION,
    "population" INTEGER,
    "established" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."EquipmentType" NOT NULL,
    "stationId" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" "public"."EquipmentStatus" NOT NULL DEFAULT 'OUT_OF_SERVICE',
    "lastInspection" TIMESTAMP(3),
    "nextInspection" TIMESTAMP(3),
    "warrantyExpiry" TIMESTAMP(3),
    "purchaseDate" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_records" (
    "id" TEXT NOT NULL,
    "stationId" TEXT,
    "equipmentId" TEXT,
    "vehicleId" TEXT,
    "type" "public"."MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "type" "public"."VehicleType" NOT NULL,
    "name" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'OUT_OF_SERVICE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "lastLocationUpdate" TIMESTAMP(3),
    "fuelLevel" DOUBLE PRECISION,
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastService" TIMESTAMP(3),
    "nextService" TIMESTAMP(3),
    "mileage" INTEGER,
    "year" INTEGER,
    "make" TEXT,
    "model" TEXT,
    "vin" TEXT,
    "licensePlate" TEXT,
    "insuranceExpiry" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hydrants" (
    "id" TEXT NOT NULL,
    "hydrantId" TEXT NOT NULL,
    "stationId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "flowRate" DOUBLE PRECISION,
    "pressure" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "lastInspection" TIMESTAMP(3),
    "nextInspection" TIMESTAMP(3),
    "accessibility" TEXT,
    "status" "public"."HydrantStatus" NOT NULL DEFAULT 'UNKNOWN',
    "type" "public"."HydrantType" NOT NULL DEFAULT 'DRY_BARREL',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hydrants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incidents" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "type" "public"."IncidentType" NOT NULL,
    "severity" "public"."IncidentSeverity" NOT NULL,
    "status" "public"."IncidentStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "stationId" TEXT,
    "callerName" TEXT,
    "callerPhone" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatchedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "containedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "estimatedLoss" DOUBLE PRECISION,
    "injuries" INTEGER NOT NULL DEFAULT 0,
    "fatalities" INTEGER NOT NULL DEFAULT 0,
    "cause" TEXT,
    "weather" TEXT,
    "temperature" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "windDirection" TEXT,
    "humidity" DOUBLE PRECISION,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incident_logs" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personnelId" TEXT,
    "vehicleId" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "incident_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evidence" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "type" "public"."EvidenceType" NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignments" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personnelId" TEXT,
    "vehicleId" TEXT,
    "role" "public"."AssignmentRole" NOT NULL,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "incidentId" TEXT,
    "userId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_badgeNumber_key" ON "public"."users"("badgeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "public"."verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "public"."verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_userId_key" ON "public"."personnel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_employeeId_key" ON "public"."personnel"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_serialNumber_key" ON "public"."equipment"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_unitId_key" ON "public"."vehicles"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "hydrants_hydrantId_key" ON "public"."hydrants"("hydrantId");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_incidentNumber_key" ON "public"."incidents"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personnel" ADD CONSTRAINT "personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personnel" ADD CONSTRAINT "personnel_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_records" ADD CONSTRAINT "training_records_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "public"."personnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."performance_reviews" ADD CONSTRAINT "performance_reviews_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "public"."personnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipment" ADD CONSTRAINT "equipment_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_records" ADD CONSTRAINT "maintenance_records_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_records" ADD CONSTRAINT "maintenance_records_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_records" ADD CONSTRAINT "maintenance_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hydrants" ADD CONSTRAINT "hydrants_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incidents" ADD CONSTRAINT "incidents_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident_logs" ADD CONSTRAINT "incident_logs_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident_logs" ADD CONSTRAINT "incident_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident_logs" ADD CONSTRAINT "incident_logs_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "public"."personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident_logs" ADD CONSTRAINT "incident_logs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidence" ADD CONSTRAINT "evidence_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "public"."personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
