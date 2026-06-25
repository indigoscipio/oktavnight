export type Mood = "grief" | "rage" | "fear" | "shame" | "loneliness";

export type OfferingStatus = "active" | "hidden" | "expired";

export type Offering = {
  id: string;
  body: string;
  mood: Mood;
  generatedName: string;
  status: OfferingStatus;
  witnessCount: number;
  candleCount: number;
  releaseCount: number;
  reportCount: number;
  createdAt: string;
  expiresAt: string;
  position: {
    x: number;
    y: number;
  };
};

export type LocalOfferingState = {
  witnessedOfferingIds: string[];
  candleOfferingIds: string[];
  releasedOfferingIds: string[];
  reportedOfferingIds: string[];
};

export type InteractionResult = {
  success: boolean;
  message: string;
};
