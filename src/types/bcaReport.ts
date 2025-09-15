export interface BCAReportRequirements {
    lineHeight: number;
    fontSize: number;
    headerSize: number;
    paragraphSize: number;
    fontFamily: string;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}

export interface BCAReport {
    id: string;
    title: string;
    content: string;
    reportType: 'project_proposal' | 'main_report' | 'minor_project';
    requirements: BCAReportRequirements;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBCAReportRequest {
    title: string;
    reportType: 'project_proposal' | 'main_report' | 'minor_project';
    requirements?: BCAReportRequirements;
    additionalInstructions?: string;
}

export interface BCAReportResponse {
    success: boolean;
    data: BCAReport;
    message: string;
}

export interface BCAReportsListResponse {
    success: boolean;
    data: {
        reports: BCAReport[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    message: string;
}

export const DEFAULT_BCA_REQUIREMENTS: BCAReportRequirements = {
    lineHeight: 1.5,
    fontSize: 12,
    headerSize: 16,
    paragraphSize: 12,
    fontFamily: 'Times New Roman',
    marginTop: 25.4, // 1 inch = 25.4mm
    marginBottom: 25.4,
    marginLeft: 31.75, // 1.25 inch = 31.75mm
    marginRight: 25.4,
};
