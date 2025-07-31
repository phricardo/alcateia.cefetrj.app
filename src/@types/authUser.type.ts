enum Campus {
  ANGRA_DOS_REIS = "ANGRA_DOS_REIS",
  ITAGUAI = "ITAGUAI",
  MARACANA = "MARACANA",
  MARIA_DA_GRACA = "MARIA_DA_GRACA",
  NOVA_FRIBURGO = "NOVA_FRIBURGO",
  NOVA_IGUACU = "NOVA_IGUACU",
  VALENCA = "VALENCA",
}

export type IAuthenticatedUser = {
  name: string;
  studentId: string;
  document?: {
    type: "NATURAL_PERSON";
    id: string;
  };
  enrollment?: string;
  course?: string;
  currentPeriod?: string;
  enrollmentPeriod?: string;
  currentDisciplines?: string[];
  campus?: Campus | null;
  enrollmentYearSemester?: string;
  studentCard?: {
    consultationURL: string;
    authCode: string;
  };
};

export type IEnrollmentValidationData = {
  student: {
    code: string;
    url: string;
  };
};
