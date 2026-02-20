export type FeatureKey =
    // Planet Features
    | 'koi_period'
    | 'koi_duration'
    | 'koi_depth'
    | 'koi_impact'
    | 'koi_model_snr'
    | 'koi_num_transits'

    // Stellar Features
    | 'st_teff'
    | 'st_logg'
    | 'st_met'
    | 'st_mass'
    | 'st_radius';

export interface FeatureConfig {
    id: FeatureKey;
    label: string;
    description: string;
    min: number;
    max: number;
    required: boolean;
    category: 'core' | 'advanced';
    section: 'planet' | 'stellar';
}

export interface PredictionFeatures extends Record<string, number> { }

export interface PredictionRequest {
    features: PredictionFeatures;
    tasks: string[];
}

export interface PredictionResponse {
    label: string;
    probability: number;
    probabilities: Record<string, number>;
    radius?: number;
    timestamp: string;
}
