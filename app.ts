export const API_BASE_URL =
  "https://easuys-retaining-tools-api.yellow-violet-f185.workers.dev";

const ALLOWED_API_ORIGINS = new Set([
  "https://easuys-retaining-tools-api.yellow-violet-f185.workers.dev",
  "https://easuys-retaining-tools-api-staging.yellow-violet-f185.workers.dev",
  "http://127.0.0.1:8787",
  "http://localhost:8787",
]);

export function resolveApiBaseUrl(search: string) {
  const override = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("api");
  if (!override) {
    return API_BASE_URL;
  }
  try {
    const parsed = new URL(override);
    return !parsed.username && !parsed.password && ALLOWED_API_ORIGINS.has(parsed.origin)
      ? parsed.origin
      : API_BASE_URL;
  } catch {
    return API_BASE_URL;
  }
}

export const ANALYSIS_ROUTE = "/calculate/retaining/flexible-wall-analysis";
export const CONTACT_ENDPOINT = "/lead/study-request";
export const TURNSTILE_SITE_KEY = "0x4AAAAAADYeVJCZgqihubKs";
export const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const APP_STATE_STORAGE_KEY = "ea-suys-retaining-contact";
const PROJECT_STORAGE_KEY = "ea-suys-retaining-project";

export const STEEL_SHEET_PILE_LIBRARY = {
  AZ_18: {
    label: "AZ 18",
    plastic_section_modulus_cm3_per_m: 1183,
    shear_area_cm2_per_m: 13.7,
  },
  AZ_26: {
    label: "AZ 26",
    plastic_section_modulus_cm3_per_m: 1650,
    shear_area_cm2_per_m: 17.8,
  },
  GU_22N: {
    label: "GU 22N",
    plastic_section_modulus_cm3_per_m: 960,
    shear_area_cm2_per_m: 12.8,
  },
} as const;

type SteelSectionInput = {
  library_section_id?: string;
  section_name?: string;
  steel_grade_mpa?: number;
  gamma_m0?: number;
  plastic_section_modulus_cm3_per_m?: number;
  shear_area_cm2_per_m?: number;
};

export type Ec7ActionType =
  | "permanent_unfavourable"
  | "permanent_favourable"
  | "variable_unfavourable"
  | "variable_favourable";

export const EC7_PARTIAL_FACTOR_DEFAULTS = {
  set1: {
    permanent_unfavourable: 1.0,
    permanent_favourable: 1.0,
    variable_unfavourable: 1.2,
    variable_favourable: 0.0,
    tan_phi: 1.0,
    cohesion: 1.0,
    subgrade_modulus: 1.0,
    effect: 1.5,
    overdig_fraction: 0.10,
    overdig_max_m: 0.5,
  },
  set2: {
    permanent_unfavourable: 1.0,
    permanent_favourable: 1.0,
    variable_unfavourable: 1.1,
    variable_favourable: 0.0,
    tan_phi: 1.25,
    cohesion: 1.25,
    subgrade_modulus: 1.0,
    effect: 1.0,
    overdig_fraction: 0.10,
    overdig_max_m: 0.5,
  },
} as const;

type Ec7PartialFactorSet = {
  permanent_unfavourable?: number;
  permanent_favourable?: number;
  variable_unfavourable?: number;
  variable_favourable?: number;
  tan_phi?: number;
  cohesion?: number;
  subgrade_modulus?: number;
  effect?: number;
  overdig_fraction?: number;
  overdig_max_m?: number;
};

type Ec7PartialFactors = {
  set1?: Ec7PartialFactorSet;
  set2?: Ec7PartialFactorSet;
};

type WallSegmentInput = {
  label?: string;
  top_level_m: number;
  bottom_level_m: number;
  ei_kNm2_per_m: number;
  steel_section?: SteelSectionInput;
  cracked_ei_kNm2_per_m?: number;
  cracking_moment_kNm_per_m?: number;
  moment_resistance_kNm_per_m?: number;
  shear_resistance_kN_per_m?: number;
};

type PhaseInput = {
  name: string;
  excavation_level_left_m: number;
  excavation_level_right_m: number;
  surface_level_left_m?: number;
  surface_level_right_m?: number;
  surface_profile_left_m?: CulmannPoint[];
  surface_profile_right_m?: CulmannPoint[];
  groundwater_level_left_m: number;
  groundwater_level_right_m: number;
  surcharge_left_kPa?: number;
  surcharge_right_kPa?: number;
  surcharge_left_action?: Ec7ActionType;
  surcharge_right_action?: Ec7ActionType;
  strip_surcharges_left?: StripSurchargeInput[];
  strip_surcharges_right?: StripSurchargeInput[];
  vertical_line_load_kN_per_m?: number;
  vertical_line_load_action?: Ec7ActionType;
  include_vertical_line_second_order?: boolean;
};

type CulmannPoint = [number | null, number | null];

type StripSurchargeInput = {
  points: CulmannPoint[];
  action?: Ec7ActionType;
};

type EarthPressureMethod = "coulomb" | "culmann";
type WallFrictionCap = "phi_over_3" | "cur166" | "none";

type SoilLayerInput = {
  top_level_m: number;
  bottom_level_m: number;
  unit_weight_dry_kN_m3: number;
  unit_weight_wet_kN_m3: number;
  friction_angle_deg: number;
  cohesion_kPa?: number;
  wall_friction_deg?: number;
  at_rest_coefficient?: number;
  active_coefficient?: number;
  passive_coefficient?: number;
  bedding_model?: "linear" | "tri_linear";
  tri_linear_displacement_breakpoints_mm?: [number, number];
  tri_linear_stiffness_factors?: [number, number, number];
  subgrade_modulus_kN_m3: number;
  pore_pressure_offset_kPa?: number;
};

type SoilProfileInput = {
  layers: SoilLayerInput[];
};

type SupportInput = {
  id: string;
  type: "anchor" | "strut" | "spring" | "underwater_concrete_block" | "rigid" | "clamp" | "point_load" | "moment";
  depth_m: number;
  side?: "left" | "right";
  inclination_degrees?: number;
  stiffness_kN_per_m?: number;
  prestress_kN_per_m?: number;
  capacity_kN_per_m?: number;
  force_kN_per_m?: number;
  moment_kNm_per_m?: number;
  action_type?: Ec7ActionType;
  active_from_phase?: number;
  active_to_phase?: number;
};

type ProjectInput = {
  design_mode: "classic" | "ec7";
  earth_pressure_method?: EarthPressureMethod;
  wall_friction_cap?: WallFrictionCap;
  ec7_partial_factors?: Ec7PartialFactors;
  wall_type: "steel_sheet_pile" | "diaphragm_wall";
  wall_geometry: {
    top_level_m: number;
    toe_level_m: number;
    inclination_degrees?: number;
    segments: WallSegmentInput[];
  };
  phases: PhaseInput[];
  soil_profiles: {
    left: SoilProfileInput;
    right: SoilProfileInput;
  };
  supports: SupportInput[];
  design_options?: {
    target_element_length_m?: number;
    max_wall_displacement_mm?: number;
    wall_length_search?: {
      start_toe_level_m: number;
      minimum_toe_level_m: number;
      step_m: number;
      max_head_displacement_mm?: number;
    };
  };
};

export const SAMPLE_PROJECT: ProjectInput = {
  design_mode: "classic",
  wall_type: "steel_sheet_pile",
  wall_geometry: {
    top_level_m: 0,
    toe_level_m: -9,
    inclination_degrees: 4,
    segments: [
      {
        label: "AZ 18 sample",
        top_level_m: 0,
        bottom_level_m: -9,
        ei_kNm2_per_m: 52000,
        steel_section: {
          library_section_id: "AZ_18",
          steel_grade_mpa: 355,
          gamma_m0: 1,
        },
      },
    ],
  },
  phases: [
    {
      name: "Initial at-rest state",
      excavation_level_left_m: 0,
      excavation_level_right_m: 0,
      groundwater_level_left_m: -2,
      groundwater_level_right_m: -2,
      surcharge_left_kPa: 0,
      surcharge_right_kPa: 12,
    },
    {
      name: "Excavate left side to -4.0 m",
      excavation_level_left_m: -4,
      excavation_level_right_m: 0,
      groundwater_level_left_m: -2,
      groundwater_level_right_m: -2,
      surcharge_left_kPa: 0,
      surcharge_right_kPa: 18,
      vertical_line_load_kN_per_m: 35,
      include_vertical_line_second_order: true,
    },
    {
      name: "Deepen excavation to -5.0 m",
      excavation_level_left_m: -5,
      excavation_level_right_m: 0,
      groundwater_level_left_m: -2,
      groundwater_level_right_m: -2,
      surcharge_left_kPa: 0,
      surcharge_right_kPa: 18,
      vertical_line_load_kN_per_m: 35,
      include_vertical_line_second_order: true,
    },
  ],
  soil_profiles: {
    left: {
      layers: [
        {
          top_level_m: 0,
          bottom_level_m: -12,
          unit_weight_dry_kN_m3: 17,
          unit_weight_wet_kN_m3: 20,
          friction_angle_deg: 30,
          cohesion_kPa: 0,
          subgrade_modulus_kN_m3: 22000,
        },
      ],
    },
    right: {
      layers: [
        {
          top_level_m: 0,
          bottom_level_m: -12,
          unit_weight_dry_kN_m3: 18,
          unit_weight_wet_kN_m3: 20,
          friction_angle_deg: 33,
          cohesion_kPa: 0,
          subgrade_modulus_kN_m3: 28000,
        },
      ],
    },
  },
  supports: [
    {
      id: "A1",
      type: "anchor",
      depth_m: 1.6,
      side: "right",
      inclination_degrees: 15,
      stiffness_kN_per_m: 9000,
      prestress_kN_per_m: 55,
      capacity_kN_per_m: 150,
      active_from_phase: 1,
    },
  ],
  design_options: {
    target_element_length_m: 0.5,
    max_wall_displacement_mm: 30,
  },
};

export const SAMPLE_RESULT: any = {
  formula_version: "retaining-ts-sample-v1",
  discretization: {
    node_levels_m: [0, -2, -4, -6, -8, -9.5],
    element_lengths_m: [2, 2, 2, 2, 1.5],
  },
  governing: {
    max_abs_displacement_mm: 16.4,
    max_abs_displacement_phase: "Deepen excavation to -5.0 m",
    max_displacement_mm: 16.4,
    max_displacement_phase: "Deepen excavation to -5.0 m",
    min_displacement_mm: -1.1,
    min_displacement_phase: "Deepen excavation to -5.0 m",
    max_abs_rotation_mrad: 4.0,
    max_abs_rotation_phase: "Deepen excavation to -5.0 m",
    max_rotation_mrad: 4.0,
    max_rotation_phase: "Deepen excavation to -5.0 m",
    min_rotation_mrad: 0,
    min_rotation_phase: "Deepen excavation to -5.0 m",
    max_abs_moment_kNm_per_m: 182.5,
    max_abs_moment_phase: "Deepen excavation to -5.0 m",
    max_moment_kNm_per_m: 182.5,
    max_moment_phase: "Deepen excavation to -5.0 m",
    min_moment_kNm_per_m: -18,
    min_moment_phase: "Deepen excavation to -5.0 m",
    max_abs_shear_kN_per_m: 102.3,
    max_abs_shear_phase: "Deepen excavation to -5.0 m",
    max_shear_kN_per_m: 102.3,
    max_shear_phase: "Deepen excavation to -5.0 m",
    min_shear_kN_per_m: -12,
    min_shear_phase: "Deepen excavation to -5.0 m",
  },
  search_evaluation: {
    selected_toe_level_m: -9.5,
    trial_count: 4,
    stop_reason: "criterion_met",
    start_toe_level_m: -8,
    minimum_toe_level_m: -10,
    step_m: 0.5,
    max_head_displacement_mm: 0.18,
    achieved_max_head_displacement_mm: 0.179,
  },
  design_checks: {
    overall_pass: true,
    serviceability: {
      assessed: true,
      max_abs_displacement_mm: 16.4,
      limit_mm: 30,
      pass: true,
    },
    wall: {
      wall_type: "steel_sheet_pile",
      governing_check: "bending",
      bending_utilization: 0.74,
      bending_demand_kNm_per_m: 182.5,
      bending_capacity_kNm_per_m: 246.622,
      bending_governing_phase: "Deepen excavation to -5.0 m",
      bending_governing_level_m: -4,
      shear_utilization: 0.41,
      shear_demand_kN_per_m: 102.3,
      shear_capacity_kN_per_m: 249.512,
      shear_governing_phase: "Deepen excavation to -5.0 m",
      shear_governing_level_m: -4,
      governing_level_m: -4,
      cracked_stiffness_state: "not_applicable",
      governing_phase: "Deepen excavation to -5.0 m",
      pass: true,
    },
    supports: [
      {
        support_id: "A1",
        support_type: "anchor",
        governing_phase: "Deepen excavation to -5.0 m",
        demand_kN_per_m: 91.4,
        capacity_kN_per_m: 144.889,
        axial_demand_kN_per_m: 94.624,
        axial_capacity_kN_per_m: 150,
        utilization_ratio: 0.631,
        pass: true,
      },
    ],
  },
  warnings: [],
  assumptions: [
    "Sample retaining result for frontend rendering and screenshot generation.",
    "Plots are rendered directly from backend visualization arrays when available.",
  ],
  source_refs: [
    "EA Suys retaining flexible wall analysis sample payload",
    "plan.md screenshot acceptance workflow",
  ],
  phases: [
    {
      name: "Initial at-rest state",
      phase_index: 0,
      converged: true,
      iterations: 1,
      envelope: {
        max_abs_displacement_mm: 3.6,
        max_abs_moment_kNm_per_m: 52.0,
        max_abs_shear_kN_per_m: 31.0,
        max_abs_plastic_offset_mm: 1.8,
      },
      support_reactions: [
        { id: "A1", type: "anchor", side: "right", depth_m: 1.6, reaction_kN_per_m: 0, branch_state: "inactive" },
      ],
      sampled_results: [
        { level_m: 0, depth_m: 0, rotation_mrad: 0, branch_state: "neutral/neutral", left_branch: "neutral", right_branch: "neutral", displacement_mm: 0, moment_kNm_per_m: 0, shear_kN_per_m: 8, net_soil_pressure_kPa: 0, water_pressure_kPa: 0 },
        { level_m: -2, depth_m: 2, rotation_mrad: 0.8, branch_state: "neutral/active", left_branch: "neutral", right_branch: "active", displacement_mm: 2.1, moment_kNm_per_m: 38, shear_kN_per_m: 25, net_soil_pressure_kPa: 6, water_pressure_kPa: 0 },
        { level_m: -4, depth_m: 4, rotation_mrad: 1.2, branch_state: "active/passive", left_branch: "active", right_branch: "passive", displacement_mm: 3.6, moment_kNm_per_m: 52, shear_kN_per_m: 31, net_soil_pressure_kPa: -4, water_pressure_kPa: 0 },
        { level_m: -6, depth_m: 6, rotation_mrad: 0.9, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 2.8, moment_kNm_per_m: 34, shear_kN_per_m: 18, net_soil_pressure_kPa: -10, water_pressure_kPa: 0 },
        { level_m: -8, depth_m: 8, rotation_mrad: 0.3, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 1.0, moment_kNm_per_m: 12, shear_kN_per_m: 7, net_soil_pressure_kPa: -6, water_pressure_kPa: 0 },
        { level_m: -9.5, depth_m: 9.5, rotation_mrad: 0.1, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: -0.2, moment_kNm_per_m: -6, shear_kN_per_m: -4, net_soil_pressure_kPa: -2, water_pressure_kPa: 0 },
      ],
    },
    {
      name: "Excavate left side to -4.0 m",
      phase_index: 1,
      converged: true,
      iterations: 6,
      envelope: {
        max_abs_displacement_mm: 12.2,
        max_abs_moment_kNm_per_m: 144.8,
        max_abs_shear_kN_per_m: 89.2,
        max_abs_plastic_offset_mm: 6.4,
      },
      normalized_vertical_line_load_kN_per_m: 35,
      support_reactions: [
        { id: "A1", type: "anchor", side: "right", depth_m: 1.6, reaction_kN_per_m: 65.1, axial_force_kN_per_m: 67.396, utilization_ratio: 0.449, branch_state: "elastic" },
      ],
      sampled_results: [
        { level_m: 0, depth_m: 0, rotation_mrad: 0, branch_state: "neutral/neutral", left_branch: "neutral", right_branch: "neutral", displacement_mm: 0, moment_kNm_per_m: 12, shear_kN_per_m: 34, net_soil_pressure_kPa: 1, water_pressure_kPa: 0 },
        { level_m: -2, depth_m: 2, rotation_mrad: 2.1, branch_state: "active/neutral", left_branch: "active", right_branch: "neutral", displacement_mm: 7.4, moment_kNm_per_m: 108, shear_kN_per_m: 74, net_soil_pressure_kPa: -12, water_pressure_kPa: 4 },
        { level_m: -4, depth_m: 4, rotation_mrad: 3.6, branch_state: "active/passive", left_branch: "active", right_branch: "passive", displacement_mm: 14.0, moment_kNm_per_m: 144.8, shear_kN_per_m: 89.2, net_soil_pressure_kPa: -24, water_pressure_kPa: 12 },
        { level_m: -6, depth_m: 6, rotation_mrad: 2.9, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 11.3, moment_kNm_per_m: 118, shear_kN_per_m: 60, net_soil_pressure_kPa: -18, water_pressure_kPa: 18 },
        { level_m: -8, depth_m: 8, rotation_mrad: 1.5, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 7.0, moment_kNm_per_m: 48, shear_kN_per_m: 20, net_soil_pressure_kPa: -6, water_pressure_kPa: 22 },
        { level_m: -9.5, depth_m: 9.5, rotation_mrad: 0.5, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: -0.7, moment_kNm_per_m: -14, shear_kN_per_m: -10, net_soil_pressure_kPa: 5, water_pressure_kPa: 26 },
      ],
    },
    {
      name: "Deepen excavation to -5.0 m",
      phase_index: 2,
      converged: true,
      iterations: 5,
      envelope: {
        max_abs_displacement_mm: 16.4,
        max_abs_moment_kNm_per_m: 182.5,
        max_abs_shear_kN_per_m: 102.3,
        max_abs_plastic_offset_mm: 9.1,
      },
      normalized_vertical_line_load_kN_per_m: 35,
      support_reactions: [
        { id: "A1", type: "anchor", side: "right", depth_m: 1.6, reaction_kN_per_m: 91.4, axial_force_kN_per_m: 94.624, utilization_ratio: 0.631, branch_state: "elastic" },
      ],
      sampled_results: [
        { level_m: 0, depth_m: 0, rotation_mrad: 0, branch_state: "neutral/neutral", left_branch: "neutral", right_branch: "neutral", displacement_mm: 0, moment_kNm_per_m: 18, shear_kN_per_m: 38, net_soil_pressure_kPa: 3, water_pressure_kPa: 0 },
        { level_m: -2, depth_m: 2, rotation_mrad: 2.5, branch_state: "active/neutral", left_branch: "active", right_branch: "neutral", displacement_mm: 9.2, moment_kNm_per_m: 132, shear_kN_per_m: 88, net_soil_pressure_kPa: -10, water_pressure_kPa: 5 },
        { level_m: -4, depth_m: 4, rotation_mrad: 4.0, branch_state: "active/passive", left_branch: "active", right_branch: "passive", displacement_mm: 16.4, moment_kNm_per_m: 182.5, shear_kN_per_m: 102.3, net_soil_pressure_kPa: -28, water_pressure_kPa: 14 },
        { level_m: -6, depth_m: 6, rotation_mrad: 3.1, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 13.7, moment_kNm_per_m: 146, shear_kN_per_m: 72, net_soil_pressure_kPa: -20, water_pressure_kPa: 20 },
        { level_m: -8, depth_m: 8, rotation_mrad: 1.8, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: 8.4, moment_kNm_per_m: 64, shear_kN_per_m: 28, net_soil_pressure_kPa: -8, water_pressure_kPa: 24 },
        { level_m: -9.5, depth_m: 9.5, rotation_mrad: 0.6, branch_state: "passive/passive", left_branch: "passive", right_branch: "passive", displacement_mm: -1.1, moment_kNm_per_m: -18, shear_kN_per_m: -12, net_soil_pressure_kPa: 6, water_pressure_kPa: 28 },
      ],
    },
  ],
};

// BEGIN GENERATED DEMO_RESULT (scripts/build_demo_result.mjs, engine formula ea-suys-retaining-formulas-2026-09-29-b)
export const DEMO_RESULT: any = {"calculator_id":"retaining_flexible_wall_analysis","version":"0.1.0","formula_version":"ea-suys-retaining-formulas-2026-09-29-b","normalized_input":{"design_mode":"classic","wall_type":"steel_sheet_pile","wall_geometry":{"top_level_m":0,"toe_level_m":-9,"inclination_degrees":4,"segments":[{"label":"AZ 18 sample","top_level_m":0,"bottom_level_m":-9,"ei_kNm2_per_m":52000,"steel_section":{"library_section_id":"AZ_18","steel_grade_mpa":355,"gamma_m0":1}}]},"phases":[{"name":"Initial at-rest state","excavation_level_left_m":0,"excavation_level_right_m":0,"groundwater_level_left_m":-2,"groundwater_level_right_m":-2,"surcharge_left_kPa":0,"surcharge_right_kPa":12},{"name":"Excavate left side to -4.0 m","excavation_level_left_m":-4,"excavation_level_right_m":0,"groundwater_level_left_m":-2,"groundwater_level_right_m":-2,"surcharge_left_kPa":0,"surcharge_right_kPa":18,"vertical_line_load_kN_per_m":35,"include_vertical_line_second_order":true},{"name":"Deepen excavation to -5.0 m","excavation_level_left_m":-5,"excavation_level_right_m":0,"groundwater_level_left_m":-2,"groundwater_level_right_m":-2,"surcharge_left_kPa":0,"surcharge_right_kPa":18,"vertical_line_load_kN_per_m":35,"include_vertical_line_second_order":true}],"soil_profiles":{"left":{"layers":[{"top_level_m":0,"bottom_level_m":-12,"unit_weight_dry_kN_m3":17,"unit_weight_wet_kN_m3":20,"friction_angle_deg":30,"cohesion_kPa":0,"subgrade_modulus_kN_m3":22000}]},"right":{"layers":[{"top_level_m":0,"bottom_level_m":-12,"unit_weight_dry_kN_m3":18,"unit_weight_wet_kN_m3":20,"friction_angle_deg":33,"cohesion_kPa":0,"subgrade_modulus_kN_m3":28000}]}},"supports":[{"id":"A1","type":"anchor","depth_m":1.6,"side":"right","inclination_degrees":15,"stiffness_kN_per_m":9000,"prestress_kN_per_m":55,"capacity_kN_per_m":150,"active_from_phase":1}],"design_options":{"target_element_length_m":0.5,"max_wall_displacement_mm":30}},"discretization":{"node_levels_m":[0,-0.5,-1,-1.5,-1.6,-2,-2.5,-3,-3.5,-4,-4.5,-5,-5.5,-6,-6.5,-7,-7.5,-8,-8.5,-9],"element_lengths_m":[0.5,0.5,0.5,0.1,0.4,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5]},"phases":[{"name":"Initial at-rest state","phase_index":0,"converged":true,"iterations":3,"sampled_results":[{"level_m":0,"depth_m":0,"displacement_mm":-0.152428,"rotation_mrad":0.0347453,"moment_kNm_per_m":1.24345e-14,"shear_kN_per_m":1.52448e-10,"shear_above_kN_per_m":0,"shear_below_kN_per_m":1.52448e-10,"net_soil_pressure_kPa":-3.53715,"left_soil_pressure_kPa":0.00051,"right_soil_pressure_kPa":3.53766,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-0.5,"depth_m":0.5,"displacement_mm":-0.135409,"rotation_mrad":0.0326248,"moment_kNm_per_m":-0.441067,"shear_kN_per_m":-0.623228,"shear_above_kN_per_m":-0.623228,"shear_below_kN_per_m":-0.623228,"net_soil_pressure_kPa":1.03822,"left_soil_pressure_kPa":7.22909,"right_soil_pressure_kPa":6.19087,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-1,"depth_m":1,"displacement_mm":-0.120303,"rotation_mrad":0.027508,"moment_kNm_per_m":-0.62322,"shear_kN_per_m":-0.151246,"shear_above_kN_per_m":-0.151246,"shear_below_kN_per_m":-0.151246,"net_soil_pressure_kPa":0.854328,"left_soil_pressure_kPa":11.1468,"right_soil_pressure_kPa":10.2924,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-1.5,"depth_m":1.5,"displacement_mm":-0.108022,"rotation_mrad":0.0216641,"moment_kNm_per_m":-0.592313,"shear_kN_per_m":0.159587,"shear_above_kN_per_m":0.159587,"shear_below_kN_per_m":0.159587,"net_soil_pressure_kPa":0.392047,"left_soil_pressure_kPa":15.1266,"right_soil_pressure_kPa":14.7345,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-1.6,"depth_m":1.6,"displacement_mm":-0.105912,"rotation_mrad":0.0205423,"moment_kNm_per_m":-0.574398,"shear_kN_per_m":0.194948,"shear_above_kN_per_m":0.194948,"shear_below_kN_per_m":0.194948,"net_soil_pressure_kPa":0.316896,"left_soil_pressure_kPa":15.9302,"right_soil_pressure_kPa":15.6133,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-2,"depth_m":2,"displacement_mm":-0.0985262,"rotation_mrad":0.016521,"moment_kNm_per_m":-0.471129,"shear_kN_per_m":0.271935,"shear_above_kN_per_m":0.271935,"shear_below_kN_per_m":0.271935,"net_soil_pressure_kPa":0.0689896,"left_soil_pressure_kPa":19.1676,"right_soil_pressure_kPa":19.0986,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-2.5,"depth_m":2.5,"displacement_mm":-0.0912824,"rotation_mrad":0.012686,"moment_kNm_per_m":-0.326559,"shear_kN_per_m":0.272737,"shear_above_kN_per_m":0.272737,"shear_below_kN_per_m":0.272737,"net_soil_pressure_kPa":-0.0657656,"left_soil_pressure_kPa":21.5558,"right_soil_pressure_kPa":21.6215,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-3,"depth_m":3,"displacement_mm":-0.0856217,"rotation_mrad":0.0101622,"moment_kNm_per_m":-0.198391,"shear_kN_per_m":0.226066,"shear_above_kN_per_m":0.226066,"shear_below_kN_per_m":0.226066,"net_soil_pressure_kPa":-0.121364,"left_soil_pressure_kPa":23.9787,"right_soil_pressure_kPa":24.1001,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-3.5,"depth_m":3.5,"displacement_mm":-0.0809391,"rotation_mrad":0.00872523,"moment_kNm_per_m":-0.100492,"shear_kN_per_m":0.16386,"shear_above_kN_per_m":0.16386,"shear_below_kN_per_m":0.16386,"net_soil_pressure_kPa":-0.128059,"left_soil_pressure_kPa":26.4232,"right_soil_pressure_kPa":26.5513,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-4,"depth_m":4,"displacement_mm":-0.0767652,"rotation_mrad":0.00807609,"moment_kNm_per_m":-0.0345299,"shear_kN_per_m":0.104658,"shear_above_kN_per_m":0.104658,"shear_below_kN_per_m":0.104658,"net_soil_pressure_kPa":-0.109318,"left_soil_pressure_kPa":28.8789,"right_soil_pressure_kPa":28.9882,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-4.5,"depth_m":4.5,"displacement_mm":-0.0727792,"rotation_mrad":0.00793011,"moment_kNm_per_m":0.00416759,"shear_kN_per_m":0.057146,"shear_above_kN_per_m":0.057146,"shear_below_kN_per_m":0.057146,"net_soil_pressure_kPa":-0.0811848,"left_soil_pressure_kPa":31.3387,"right_soil_pressure_kPa":31.4199,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-5,"depth_m":5,"displacement_mm":-0.0687893,"rotation_mrad":0.00805889,"moment_kNm_per_m":0.0226172,"shear_kN_per_m":0.023619,"shear_above_kN_per_m":0.023619,"shear_below_kN_per_m":0.023619,"net_soil_pressure_kPa":-0.0532418,"left_soil_pressure_kPa":33.7984,"right_soil_pressure_kPa":33.8517,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-5.5,"depth_m":5.5,"displacement_mm":-0.0647013,"rotation_mrad":0.00830122,"moment_kNm_per_m":0.0277877,"shear_kN_per_m":0.00280619,"shear_above_kN_per_m":0.00280619,"shear_below_kN_per_m":0.00280619,"net_soil_pressure_kPa":-0.0302036,"left_soil_pressure_kPa":36.256,"right_soil_pressure_kPa":36.2862,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-6,"depth_m":6,"displacement_mm":-0.0604858,"rotation_mrad":0.00855705,"moment_kNm_per_m":0.0254246,"shear_kN_per_m":-0.00810618,"shear_above_kN_per_m":-0.00810618,"shear_below_kN_per_m":-0.00810618,"net_soil_pressure_kPa":-0.0135433,"left_soil_pressure_kPa":38.7107,"right_soil_pressure_kPa":38.7243,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-6.5,"depth_m":6.5,"displacement_mm":-0.0561508,"rotation_mrad":0.00877391,"moment_kNm_per_m":0.0196827,"shear_kN_per_m":-0.0121991,"shear_above_kN_per_m":-0.0121991,"shear_below_kN_per_m":-0.0121991,"net_soil_pressure_kPa":-0.00285939,"left_soil_pressure_kPa":41.1629,"right_soil_pressure_kPa":41.1657,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-7,"depth_m":7,"displacement_mm":-0.0517217,"rotation_mrad":0.00893212,"moment_kNm_per_m":0.0132266,"shear_kN_per_m":-0.012136,"shear_above_kN_per_m":-0.012136,"shear_below_kN_per_m":-0.012136,"net_soil_pressure_kPa":0.00312177,"left_soil_pressure_kPa":43.6129,"right_soil_pressure_kPa":43.6098,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-7.5,"depth_m":7.5,"displacement_mm":-0.0472284,"rotation_mrad":0.009032,"moment_kNm_per_m":0.00754783,"shear_kN_per_m":-0.00989021,"shear_above_kN_per_m":-0.00989021,"shear_below_kN_per_m":-0.00989021,"net_soil_pressure_kPa":0.00589232,"left_soil_pressure_kPa":46.0616,"right_soil_pressure_kPa":46.0557,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-8,"depth_m":8,"displacement_mm":-0.0426976,"rotation_mrad":0.00908433,"moment_kNm_per_m":0.00333747,"shear_kN_per_m":-0.00672971,"shear_above_kN_per_m":-0.00672971,"shear_below_kN_per_m":-0.00672971,"net_soil_pressure_kPa":0.00678967,"left_soil_pressure_kPa":48.5094,"right_soil_pressure_kPa":48.5026,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-8.5,"depth_m":8.5,"displacement_mm":-0.0381494,"rotation_mrad":0.00910432,"moment_kNm_per_m":0.000819263,"shear_kN_per_m":-0.00333861,"shear_above_kN_per_m":-0.00333861,"shear_below_kN_per_m":-0.00333861,"net_soil_pressure_kPa":0.00681694,"left_soil_pressure_kPa":50.9568,"right_soil_pressure_kPa":50.95,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-9,"depth_m":9,"displacement_mm":-0.033596,"rotation_mrad":0.00910826,"moment_kNm_per_m":4.44089e-16,"shear_kN_per_m":-3.36199e-11,"shear_above_kN_per_m":-3.36199e-11,"shear_below_kN_per_m":0,"net_soil_pressure_kPa":0.00657011,"left_soil_pressure_kPa":53.4041,"right_soil_pressure_kPa":53.3975,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"}],"support_reactions":[{"id":"A1","type":"anchor","side":"right","depth_m":1.6,"reaction_kN_per_m":0,"branch_state":"inactive"}],"envelope":{"max_abs_displacement_mm":0.152428,"max_abs_moment_kNm_per_m":0.62322,"max_abs_shear_kN_per_m":0.623228,"max_abs_plastic_offset_mm":0}},{"name":"Excavate left side to -4.0 m","phase_index":1,"converged":true,"iterations":4,"sampled_results":[{"level_m":0,"depth_m":0,"displacement_mm":0.0859331,"rotation_mrad":-0.471516,"moment_kNm_per_m":2.84217e-14,"shear_kN_per_m":-8.59148e-11,"shear_above_kN_per_m":0,"shear_below_kN_per_m":-8.59148e-11,"net_soil_pressure_kPa":-12.944,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":12.944,"water_pressure_kPa":0,"branch_state":"inactive/neutral","left_branch":"inactive","right_branch":"neutral"},{"level_m":-0.5,"depth_m":0.5,"displacement_mm":-0.151112,"rotation_mrad":-0.479236,"moment_kNm_per_m":-1.60576,"shear_kN_per_m":-5.34376,"shear_above_kN_per_m":-5.34376,"shear_below_kN_per_m":-5.34376,"net_soil_pressure_kPa":-8.48337,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":8.48337,"water_pressure_kPa":0,"branch_state":"inactive/neutral","left_branch":"inactive","right_branch":"neutral"},{"level_m":-1,"depth_m":1,"displacement_mm":-0.397571,"rotation_mrad":-0.512566,"moment_kNm_per_m":-5.32685,"shear_kN_per_m":-10.1062,"shear_above_kN_per_m":-10.1062,"shear_below_kN_per_m":-10.1062,"net_soil_pressure_kPa":-10.6129,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":10.6129,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-1.5,"depth_m":1.5,"displacement_mm":-0.671761,"rotation_mrad":-0.594397,"moment_kNm_per_m":-11.6937,"shear_kN_per_m":-16.0613,"shear_above_kN_per_m":-16.0613,"shear_below_kN_per_m":-16.0613,"net_soil_pressure_kPa":-13.2661,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":13.2661,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-1.6,"depth_m":1.6,"displacement_mm":-0.732379,"rotation_mrad":-0.618491,"moment_kNm_per_m":-13.3639,"shear_kN_per_m":35.7147,"shear_above_kN_per_m":-17.4112,"shear_below_kN_per_m":35.7147,"net_soil_pressure_kPa":-13.7967,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":13.7967,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-2,"depth_m":2,"displacement_mm":-0.993569,"rotation_mrad":-0.670545,"moment_kNm_per_m":-0.169907,"shear_kN_per_m":29.786,"shear_above_kN_per_m":29.786,"shear_below_kN_per_m":29.786,"net_soil_pressure_kPa":-15.9193,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":15.9193,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-2.5,"depth_m":2.5,"displacement_mm":-1.3189,"rotation_mrad":-0.610065,"moment_kNm_per_m":12.7494,"shear_kN_per_m":21.4712,"shear_above_kN_per_m":21.4712,"shear_below_kN_per_m":21.4712,"net_soil_pressure_kPa":-17.4213,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":17.4213,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-3,"depth_m":3,"displacement_mm":-1.58641,"rotation_mrad":-0.446258,"moment_kNm_per_m":21.322,"shear_kN_per_m":12.4072,"shear_above_kN_per_m":12.4072,"shear_below_kN_per_m":12.4072,"net_soil_pressure_kPa":-18.9233,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":18.9233,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-3.5,"depth_m":3.5,"displacement_mm":-1.7552,"rotation_mrad":-0.222726,"moment_kNm_per_m":25.1719,"shear_kN_per_m":2.59403,"shear_above_kN_per_m":2.59403,"shear_below_kN_per_m":2.59403,"net_soil_pressure_kPa":-20.4253,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":20.4253,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-4,"depth_m":4,"displacement_mm":-1.80705,"rotation_mrad":0.0133143,"moment_kNm_per_m":23.9238,"shear_kN_per_m":-7.96832,"shear_above_kN_per_m":-7.96832,"shear_below_kN_per_m":-7.96832,"net_soil_pressure_kPa":-21.927,"left_soil_pressure_kPa":0.0003057,"right_soil_pressure_kPa":21.9273,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-4.5,"depth_m":4.5,"displacement_mm":-1.74827,"rotation_mrad":0.211044,"moment_kNm_per_m":17.2034,"shear_kN_per_m":-15.4679,"shear_above_kN_per_m":-15.4679,"shear_below_kN_per_m":-15.4679,"net_soil_pressure_kPa":-8.14403,"left_soil_pressure_kPa":15.2853,"right_soil_pressure_kPa":23.4293,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-5,"depth_m":5,"displacement_mm":-1.60841,"rotation_mrad":0.334374,"moment_kNm_per_m":8.44901,"shear_kN_per_m":-16.0928,"shear_above_kN_per_m":-16.0928,"shear_below_kN_per_m":-16.0928,"net_soil_pressure_kPa":5.63896,"left_soil_pressure_kPa":30.5703,"right_soil_pressure_kPa":24.9313,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-5.5,"depth_m":5.5,"displacement_mm":-1.4268,"rotation_mrad":0.380281,"moment_kNm_per_m":1.09942,"shear_kN_per_m":-11.5444,"shear_above_kN_per_m":-11.5444,"shear_below_kN_per_m":-11.5444,"net_soil_pressure_kPa":12.5988,"left_soil_pressure_kPa":39.0322,"right_soil_pressure_kPa":26.4334,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-6,"depth_m":6,"displacement_mm":-1.23739,"rotation_mrad":0.370622,"moment_kNm_per_m":-3.10842,"shear_kN_per_m":-6.03887,"shear_above_kN_per_m":-6.03887,"shear_below_kN_per_m":-6.03887,"net_soil_pressure_kPa":9.47728,"left_soil_pressure_kPa":37.4126,"right_soil_pressure_kPa":27.9354,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-6.5,"depth_m":6.5,"displacement_mm":-1.06103,"rotation_mrad":0.331868,"moment_kNm_per_m":-4.95225,"shear_kN_per_m":-2.01867,"shear_above_kN_per_m":-2.01867,"shear_below_kN_per_m":-2.01867,"net_soil_pressure_kPa":6.64282,"left_soil_pressure_kPa":36.0802,"right_soil_pressure_kPa":29.4374,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-7,"depth_m":7,"displacement_mm":-0.907149,"rotation_mrad":0.283354,"moment_kNm_per_m":-5.13864,"shear_kN_per_m":0.711093,"shear_above_kN_per_m":0.711093,"shear_below_kN_per_m":0.711093,"net_soil_pressure_kPa":4.30294,"left_soil_pressure_kPa":35.2423,"right_soil_pressure_kPa":30.9394,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-7.5,"depth_m":7.5,"displacement_mm":-0.777113,"rotation_mrad":0.23821,"moment_kNm_per_m":-4.25109,"shear_kN_per_m":2.4046,"shear_above_kN_per_m":2.4046,"shear_below_kN_per_m":2.4046,"net_soil_pressure_kPa":2.48765,"left_soil_pressure_kPa":34.929,"right_soil_pressure_kPa":32.4414,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-8,"depth_m":8,"displacement_mm":-0.667019,"rotation_mrad":0.204587,"moment_kNm_per_m":-2.74244,"shear_kN_per_m":3.30207,"shear_above_kN_per_m":3.30207,"shear_below_kN_per_m":3.30207,"net_soil_pressure_kPa":1.11105,"left_soil_pressure_kPa":35.0545,"right_soil_pressure_kPa":33.9434,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-8.5,"depth_m":8.5,"displacement_mm":-0.569886,"rotation_mrad":0.186805,"moment_kNm_per_m":-0.956263,"shear_kN_per_m":2.74906,"shear_above_kN_per_m":2.74906,"shear_below_kN_per_m":2.74906,"net_soil_pressure_kPa":-3.32851,"left_soil_pressure_kPa":35.465,"right_soil_pressure_kPa":38.7936,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-9,"depth_m":9,"displacement_mm":-0.478016,"rotation_mrad":0.182207,"moment_kNm_per_m":1.27898e-13,"shear_kN_per_m":-4.78456e-10,"shear_above_kN_per_m":-4.78456e-10,"shear_below_kN_per_m":0,"net_soil_pressure_kPa":-7.69457,"left_soil_pressure_kPa":35.9913,"right_soil_pressure_kPa":43.6859,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"}],"support_reactions":[{"id":"A1","type":"anchor","side":"right","depth_m":1.6,"reaction_kN_per_m":53.126,"axial_force_kN_per_m":55,"utilization_ratio":0.367,"branch_state":"elastic"}],"envelope":{"max_abs_displacement_mm":1.80705,"max_abs_moment_kNm_per_m":25.1719,"max_abs_shear_kN_per_m":35.7147,"max_abs_plastic_offset_mm":0.152428}},{"name":"Deepen excavation to -5.0 m","phase_index":2,"converged":true,"iterations":4,"sampled_results":[{"level_m":0,"depth_m":0,"displacement_mm":0.159746,"rotation_mrad":-1.44857,"moment_kNm_per_m":-5.68434e-14,"shear_kN_per_m":-1.59597e-10,"shear_above_kN_per_m":0,"shear_below_kN_per_m":-1.59597e-10,"net_soil_pressure_kPa":-15.0107,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":15.0107,"water_pressure_kPa":0,"branch_state":"inactive/neutral","left_branch":"inactive","right_branch":"neutral"},{"level_m":-0.5,"depth_m":0.5,"displacement_mm":-0.56602,"rotation_mrad":-1.45745,"moment_kNm_per_m":-1.84637,"shear_kN_per_m":-5.72858,"shear_above_kN_per_m":-5.72858,"shear_below_kN_per_m":-5.72858,"net_soil_pressure_kPa":-7.95968,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":7.95968,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-1,"depth_m":1,"displacement_mm":-1.30225,"rotation_mrad":-1.49362,"moment_kNm_per_m":-5.67743,"shear_kN_per_m":-10.3604,"shear_above_kN_per_m":-10.3604,"shear_below_kN_per_m":-10.3604,"net_soil_pressure_kPa":-10.6129,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":10.6129,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-1.5,"depth_m":1.5,"displacement_mm":-2.0679,"rotation_mrad":-1.57935,"moment_kNm_per_m":-12.1542,"shear_kN_per_m":-16.3156,"shear_above_kN_per_m":-16.3156,"shear_below_kN_per_m":-16.3156,"net_soil_pressure_kPa":-13.2661,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":13.2661,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-1.6,"depth_m":1.6,"displacement_mm":-2.22706,"rotation_mrad":-1.60435,"moment_kNm_per_m":-13.8464,"shear_kN_per_m":48.0116,"shear_above_kN_per_m":-17.6654,"shear_below_kN_per_m":48.0116,"net_soil_pressure_kPa":-13.7967,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":13.7967,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-2,"depth_m":2,"displacement_mm":-2.88081,"rotation_mrad":-1.64115,"moment_kNm_per_m":4.28011,"shear_kN_per_m":42.0829,"shear_above_kN_per_m":42.0829,"shear_below_kN_per_m":42.0829,"net_soil_pressure_kPa":-15.9193,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":15.9193,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-2.5,"depth_m":2.5,"displacement_mm":-3.6758,"rotation_mrad":-1.50824,"moment_kNm_per_m":23.3643,"shear_kN_per_m":33.7681,"shear_above_kN_per_m":33.7681,"shear_below_kN_per_m":33.7681,"net_soil_pressure_kPa":-17.4213,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":17.4213,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-3,"depth_m":3,"displacement_mm":-4.36195,"rotation_mrad":-1.21273,"moment_kNm_per_m":38.1,"shear_kN_per_m":24.7041,"shear_above_kN_per_m":24.7041,"shear_below_kN_per_m":24.7041,"net_soil_pressure_kPa":-18.9233,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":18.9233,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-3.5,"depth_m":3.5,"displacement_mm":-4.8687,"rotation_mrad":-0.798255,"moment_kNm_per_m":48.1101,"shear_kN_per_m":14.8909,"shear_above_kN_per_m":14.8909,"shear_below_kN_per_m":14.8909,"net_soil_pressure_kPa":-20.4253,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":20.4253,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-4,"depth_m":4,"displacement_mm":-5.14825,"rotation_mrad":-0.312053,"moment_kNm_per_m":53.0184,"shear_kN_per_m":4.32855,"shear_above_kN_per_m":4.32855,"shear_below_kN_per_m":4.32855,"net_soil_pressure_kPa":-21.9273,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":21.9273,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-4.5,"depth_m":4.5,"displacement_mm":-5.17728,"rotation_mrad":0.195011,"moment_kNm_per_m":52.4495,"shear_kN_per_m":-6.98298,"shear_above_kN_per_m":-6.98298,"shear_below_kN_per_m":-6.98298,"net_soil_pressure_kPa":-23.4293,"left_soil_pressure_kPa":0,"right_soil_pressure_kPa":23.4293,"water_pressure_kPa":0,"branch_state":"inactive/active","left_branch":"inactive","right_branch":"active"},{"level_m":-5,"depth_m":5,"displacement_mm":-4.95884,"rotation_mrad":0.668471,"moment_kNm_per_m":46.0288,"shear_kN_per_m":-19.0437,"shear_above_kN_per_m":-19.0437,"shear_below_kN_per_m":-19.0437,"net_soil_pressure_kPa":-24.931,"left_soil_pressure_kPa":0.0003057,"right_soil_pressure_kPa":24.9313,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-5.5,"depth_m":5.5,"displacement_mm":-4.52409,"rotation_mrad":1.05026,"moment_kNm_per_m":33.383,"shear_kN_per_m":-28.0416,"shear_above_kN_per_m":-28.0416,"shear_below_kN_per_m":-28.0416,"net_soil_pressure_kPa":-11.148,"left_soil_pressure_kPa":15.2853,"right_soil_pressure_kPa":26.4334,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-6,"depth_m":6,"displacement_mm":-3.93107,"rotation_mrad":1.29707,"moment_kNm_per_m":17.9513,"shear_kN_per_m":-30.1648,"shear_above_kN_per_m":-30.1648,"shear_below_kN_per_m":-30.1648,"net_soil_pressure_kPa":2.63494,"left_soil_pressure_kPa":30.5703,"right_soil_pressure_kPa":27.9354,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-6.5,"depth_m":6.5,"displacement_mm":-3.25123,"rotation_mrad":1.39863,"moment_kNm_per_m":3.17363,"shear_kN_per_m":-25.4134,"shear_above_kN_per_m":-25.4134,"shear_below_kN_per_m":-25.4134,"net_soil_pressure_kPa":16.4179,"left_soil_pressure_kPa":45.8553,"right_soil_pressure_kPa":29.4374,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-7,"depth_m":7,"displacement_mm":-2.55284,"rotation_mrad":1.37778,"moment_kNm_per_m":-7.51025,"shear_kN_per_m":-13.7872,"shear_above_kN_per_m":-13.7872,"shear_below_kN_per_m":-13.7872,"net_soil_pressure_kPa":30.2009,"left_soil_pressure_kPa":61.1403,"right_soil_pressure_kPa":30.9394,"water_pressure_kPa":0,"branch_state":"passive/active","left_branch":"passive","right_branch":"active"},{"level_m":-7.5,"depth_m":7.5,"displacement_mm":-1.88453,"rotation_mrad":1.29042,"moment_kNm_per_m":-10.6613,"shear_kN_per_m":-0.829638,"shear_above_kN_per_m":-0.829638,"shear_below_kN_per_m":-0.829638,"net_soil_pressure_kPa":21.7559,"left_soil_pressure_kPa":54.1973,"right_soil_pressure_kPa":32.4414,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-8,"depth_m":8,"displacement_mm":-1.26313,"rotation_mrad":1.19885,"moment_kNm_per_m":-8.38502,"shear_kN_per_m":6.87313,"shear_above_kN_per_m":6.87313,"shear_below_kN_per_m":6.87313,"net_soil_pressure_kPa":9.13048,"left_soil_pressure_kPa":43.0739,"right_soil_pressure_kPa":33.9434,"water_pressure_kPa":0,"branch_state":"neutral/active","left_branch":"neutral","right_branch":"active"},{"level_m":-8.5,"depth_m":8.5,"displacement_mm":-0.680213,"rotation_mrad":1.14012,"moment_kNm_per_m":-3.83033,"shear_kN_per_m":8.42516,"shear_above_kN_per_m":8.42516,"shear_below_kN_per_m":8.42516,"net_soil_pressure_kPa":-2.90718,"left_soil_pressure_kPa":32.7972,"right_soil_pressure_kPa":35.7044,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"},{"level_m":-9,"depth_m":9,"displacement_mm":-0.116293,"rotation_mrad":1.1217,"moment_kNm_per_m":-5.68434e-14,"shear_kN_per_m":-1.15664e-10,"shear_above_kN_per_m":-1.15664e-10,"shear_below_kN_per_m":0,"net_soil_pressure_kPa":-30.8758,"left_soil_pressure_kPa":22.9384,"right_soil_pressure_kPa":53.8142,"water_pressure_kPa":0,"branch_state":"neutral/neutral","left_branch":"neutral","right_branch":"neutral"}],"support_reactions":[{"id":"A1","type":"anchor","side":"right","depth_m":1.6,"reaction_kN_per_m":65.677,"axial_force_kN_per_m":67.994,"utilization_ratio":0.453,"branch_state":"elastic"}],"envelope":{"max_abs_displacement_mm":5.17728,"max_abs_moment_kNm_per_m":53.0184,"max_abs_shear_kN_per_m":48.0116,"max_abs_plastic_offset_mm":1.80705}}],"governing":{"max_abs_displacement_mm":5.177,"max_abs_displacement_phase":"Deepen excavation to -5.0 m","max_displacement_mm":0.16,"max_displacement_phase":"Deepen excavation to -5.0 m","min_displacement_mm":-5.177,"min_displacement_phase":"Deepen excavation to -5.0 m","max_abs_rotation_mrad":1.641,"max_abs_rotation_phase":"Deepen excavation to -5.0 m","max_rotation_mrad":1.399,"max_rotation_phase":"Deepen excavation to -5.0 m","min_rotation_mrad":-1.641,"min_rotation_phase":"Deepen excavation to -5.0 m","max_abs_moment_kNm_per_m":53.018,"max_abs_moment_phase":"Deepen excavation to -5.0 m","max_moment_kNm_per_m":53.018,"max_moment_phase":"Deepen excavation to -5.0 m","min_moment_kNm_per_m":-13.846,"min_moment_phase":"Deepen excavation to -5.0 m","max_abs_shear_kN_per_m":48.012,"max_abs_shear_phase":"Deepen excavation to -5.0 m","max_shear_kN_per_m":48.012,"max_shear_phase":"Deepen excavation to -5.0 m","min_shear_kN_per_m":-30.165,"min_shear_phase":"Deepen excavation to -5.0 m"},"design_checks":{"wall":{"wall_type":"steel_sheet_pile","governing_check":"shear","governing_phase":"Deepen excavation to -5.0 m","governing_level_m":-1.6,"bending_governing_phase":"Deepen excavation to -5.0 m","bending_governing_level_m":-4,"bending_demand_kNm_per_m":53.018,"bending_capacity_kNm_per_m":419.965,"bending_utilization":0.126,"shear_governing_phase":"Deepen excavation to -5.0 m","shear_governing_level_m":-1.6,"shear_demand_kN_per_m":48.012,"shear_capacity_kN_per_m":280.794,"shear_utilization":0.171,"cracked_stiffness_state":"not_applicable","pass":true},"supports":[{"support_id":"A1","support_type":"anchor","governing_phase":"Deepen excavation to -5.0 m","demand_kN_per_m":65.677,"capacity_kN_per_m":144.889,"axial_demand_kN_per_m":67.994,"axial_capacity_kN_per_m":150,"utilization_ratio":0.453,"pass":true}],"serviceability":{"assessed":true,"max_abs_displacement_mm":5.177,"limit_mm":30,"pass":true},"overall_pass":true},"visualization":{"phases":[{"name":"Initial at-rest state","phase_index":0,"converged":true,"iterations":3,"levels_m":[0,-0.5,-1,-1.5,-1.6,-2,-2.5,-3,-3.5,-4,-4.5,-5,-5.5,-6,-6.5,-7,-7.5,-8,-8.5,-9],"displacement_mm":[-0.152428,-0.135409,-0.120303,-0.108022,-0.105912,-0.0985262,-0.0912824,-0.0856217,-0.0809391,-0.0767652,-0.0727792,-0.0687893,-0.0647013,-0.0604858,-0.0561508,-0.0517217,-0.0472284,-0.0426976,-0.0381494,-0.033596],"rotation_mrad":[0.0347453,0.0326248,0.027508,0.0216641,0.0205423,0.016521,0.012686,0.0101622,0.00872523,0.00807609,0.00793011,0.00805889,0.00830122,0.00855705,0.00877391,0.00893212,0.009032,0.00908433,0.00910432,0.00910826],"moment_kNm_per_m":[1.24345e-14,-0.441067,-0.62322,-0.592313,-0.574398,-0.471129,-0.326559,-0.198391,-0.100492,-0.0345299,0.00416759,0.0226172,0.0277877,0.0254246,0.0196827,0.0132266,0.00754783,0.00333747,0.000819263,4.44089e-16],"shear_kN_per_m":[1.52448e-10,-0.623228,-0.151246,0.159587,0.194948,0.271935,0.272737,0.226066,0.16386,0.104658,0.057146,0.023619,0.00280619,-0.00810618,-0.0121991,-0.012136,-0.00989021,-0.00672971,-0.00333861,-3.36199e-11],"shear_above_kN_per_m":[0,-0.623228,-0.151246,0.159587,0.194948,0.271935,0.272737,0.226066,0.16386,0.104658,0.057146,0.023619,0.00280619,-0.00810618,-0.0121991,-0.012136,-0.00989021,-0.00672971,-0.00333861,-3.36199e-11],"shear_below_kN_per_m":[1.52448e-10,-0.623228,-0.151246,0.159587,0.194948,0.271935,0.272737,0.226066,0.16386,0.104658,0.057146,0.023619,0.00280619,-0.00810618,-0.0121991,-0.012136,-0.00989021,-0.00672971,-0.00333861,0],"net_soil_pressure_kPa":[-3.53715,1.03822,0.854328,0.392047,0.316896,0.0689896,-0.0657656,-0.121364,-0.128059,-0.109318,-0.0811848,-0.0532418,-0.0302036,-0.0135433,-0.00285939,0.00312177,0.00589232,0.00678967,0.00681694,0.00657011],"left_soil_pressure_kPa":[0.00051,7.22909,11.1468,15.1266,15.9302,19.1676,21.5558,23.9787,26.4232,28.8789,31.3387,33.7984,36.256,38.7107,41.1629,43.6129,46.0616,48.5094,50.9568,53.4041],"right_soil_pressure_kPa":[3.53766,6.19087,10.2924,14.7345,15.6133,19.0986,21.6215,24.1001,26.5513,28.9882,31.4199,33.8517,36.2862,38.7243,41.1657,43.6098,46.0557,48.5026,50.95,53.3975],"water_pressure_kPa":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"branch_state":["passive/active","neutral/active","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral","neutral/neutral"],"left_branch":["passive","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral"],"right_branch":["active","active","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral"]},{"name":"Excavate left side to -4.0 m","phase_index":1,"converged":true,"iterations":4,"levels_m":[0,-0.5,-1,-1.5,-1.6,-2,-2.5,-3,-3.5,-4,-4.5,-5,-5.5,-6,-6.5,-7,-7.5,-8,-8.5,-9],"displacement_mm":[0.0859331,-0.151112,-0.397571,-0.671761,-0.732379,-0.993569,-1.3189,-1.58641,-1.7552,-1.80705,-1.74827,-1.60841,-1.4268,-1.23739,-1.06103,-0.907149,-0.777113,-0.667019,-0.569886,-0.478016],"rotation_mrad":[-0.471516,-0.479236,-0.512566,-0.594397,-0.618491,-0.670545,-0.610065,-0.446258,-0.222726,0.0133143,0.211044,0.334374,0.380281,0.370622,0.331868,0.283354,0.23821,0.204587,0.186805,0.182207],"moment_kNm_per_m":[2.84217e-14,-1.60576,-5.32685,-11.6937,-13.3639,-0.169907,12.7494,21.322,25.1719,23.9238,17.2034,8.44901,1.09942,-3.10842,-4.95225,-5.13864,-4.25109,-2.74244,-0.956263,1.27898e-13],"shear_kN_per_m":[-8.59148e-11,-5.34376,-10.1062,-16.0613,35.7147,29.786,21.4712,12.4072,2.59403,-7.96832,-15.4679,-16.0928,-11.5444,-6.03887,-2.01867,0.711093,2.4046,3.30207,2.74906,-4.78456e-10],"shear_above_kN_per_m":[0,-5.34376,-10.1062,-16.0613,-17.4112,29.786,21.4712,12.4072,2.59403,-7.96832,-15.4679,-16.0928,-11.5444,-6.03887,-2.01867,0.711093,2.4046,3.30207,2.74906,-4.78456e-10],"shear_below_kN_per_m":[-8.59148e-11,-5.34376,-10.1062,-16.0613,35.7147,29.786,21.4712,12.4072,2.59403,-7.96832,-15.4679,-16.0928,-11.5444,-6.03887,-2.01867,0.711093,2.4046,3.30207,2.74906,0],"net_soil_pressure_kPa":[-12.944,-8.48337,-10.6129,-13.2661,-13.7967,-15.9193,-17.4213,-18.9233,-20.4253,-21.927,-8.14403,5.63896,12.5988,9.47728,6.64282,4.30294,2.48765,1.11105,-3.32851,-7.69457],"left_soil_pressure_kPa":[0,0,0,0,0,0,0,0,0,0.0003057,15.2853,30.5703,39.0322,37.4126,36.0802,35.2423,34.929,35.0545,35.465,35.9913],"right_soil_pressure_kPa":[12.944,8.48337,10.6129,13.2661,13.7967,15.9193,17.4213,18.9233,20.4253,21.9273,23.4293,24.9313,26.4334,27.9354,29.4374,30.9394,32.4414,33.9434,38.7936,43.6859],"water_pressure_kPa":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"branch_state":["inactive/neutral","inactive/neutral","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","passive/active","passive/active","passive/active","neutral/active","neutral/active","neutral/active","neutral/active","neutral/active","neutral/active","neutral/neutral","neutral/neutral"],"left_branch":["inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","passive","passive","passive","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral"],"right_branch":["neutral","neutral","active","active","active","active","active","active","active","active","active","active","active","active","active","active","active","active","neutral","neutral"]},{"name":"Deepen excavation to -5.0 m","phase_index":2,"converged":true,"iterations":4,"levels_m":[0,-0.5,-1,-1.5,-1.6,-2,-2.5,-3,-3.5,-4,-4.5,-5,-5.5,-6,-6.5,-7,-7.5,-8,-8.5,-9],"displacement_mm":[0.159746,-0.56602,-1.30225,-2.0679,-2.22706,-2.88081,-3.6758,-4.36195,-4.8687,-5.14825,-5.17728,-4.95884,-4.52409,-3.93107,-3.25123,-2.55284,-1.88453,-1.26313,-0.680213,-0.116293],"rotation_mrad":[-1.44857,-1.45745,-1.49362,-1.57935,-1.60435,-1.64115,-1.50824,-1.21273,-0.798255,-0.312053,0.195011,0.668471,1.05026,1.29707,1.39863,1.37778,1.29042,1.19885,1.14012,1.1217],"moment_kNm_per_m":[-5.68434e-14,-1.84637,-5.67743,-12.1542,-13.8464,4.28011,23.3643,38.1,48.1101,53.0184,52.4495,46.0288,33.383,17.9513,3.17363,-7.51025,-10.6613,-8.38502,-3.83033,-5.68434e-14],"shear_kN_per_m":[-1.59597e-10,-5.72858,-10.3604,-16.3156,48.0116,42.0829,33.7681,24.7041,14.8909,4.32855,-6.98298,-19.0437,-28.0416,-30.1648,-25.4134,-13.7872,-0.829638,6.87313,8.42516,-1.15664e-10],"shear_above_kN_per_m":[0,-5.72858,-10.3604,-16.3156,-17.6654,42.0829,33.7681,24.7041,14.8909,4.32855,-6.98298,-19.0437,-28.0416,-30.1648,-25.4134,-13.7872,-0.829638,6.87313,8.42516,-1.15664e-10],"shear_below_kN_per_m":[-1.59597e-10,-5.72858,-10.3604,-16.3156,48.0116,42.0829,33.7681,24.7041,14.8909,4.32855,-6.98298,-19.0437,-28.0416,-30.1648,-25.4134,-13.7872,-0.829638,6.87313,8.42516,0],"net_soil_pressure_kPa":[-15.0107,-7.95968,-10.6129,-13.2661,-13.7967,-15.9193,-17.4213,-18.9233,-20.4253,-21.9273,-23.4293,-24.931,-11.148,2.63494,16.4179,30.2009,21.7559,9.13048,-2.90718,-30.8758],"left_soil_pressure_kPa":[0,0,0,0,0,0,0,0,0,0,0,0.0003057,15.2853,30.5703,45.8553,61.1403,54.1973,43.0739,32.7972,22.9384],"right_soil_pressure_kPa":[15.0107,7.95968,10.6129,13.2661,13.7967,15.9193,17.4213,18.9233,20.4253,21.9273,23.4293,24.9313,26.4334,27.9354,29.4374,30.9394,32.4414,33.9434,35.7044,53.8142],"water_pressure_kPa":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"branch_state":["inactive/neutral","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","inactive/active","passive/active","passive/active","passive/active","passive/active","passive/active","neutral/active","neutral/active","neutral/neutral","neutral/neutral"],"left_branch":["inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","inactive","passive","passive","passive","passive","passive","neutral","neutral","neutral","neutral"],"right_branch":["neutral","active","active","active","active","active","active","active","active","active","active","active","active","active","active","active","active","active","neutral","neutral"]}]},"assumptions":["Wall solved as a 2 DOF Euler-Bernoulli beam line.","Soil response represented by left/right capped Winkler-type springs with carried offsets.","Inclined walls use an approximate horizontal-component treatment for soil and water loads based on the wall angle from vertical."],"source_refs":["/home/user/plan.md","/home/user/projects/Engineering-Scripts/RetainingWall/README.md","/home/user/projects/Engineering-Scripts/RetainingWall/reference/solver_notes.md"],"warnings":["NODAL_PRESSURE_LUMPING"]};
// END GENERATED DEMO_RESULT

SAMPLE_RESULT.normalized_input = structuredClone(SAMPLE_PROJECT);

SAMPLE_RESULT.visualization = {
  phases: SAMPLE_RESULT.phases.map((phase: any, phaseIndex: number) => ({
    name: phase.name,
    phase_index: phase.phase_index ?? phaseIndex,
    converged: phase.converged ?? true,
    iterations: phase.iterations ?? 0,
    levels_m: phase.sampled_results.map((item: any) => item.level_m),
    displacement_mm: phase.sampled_results.map((item: any) => item.displacement_mm),
    rotation_mrad: phase.sampled_results.map((item: any) => item.rotation_mrad),
    moment_kNm_per_m: phase.sampled_results.map((item: any) => item.moment_kNm_per_m),
    shear_kN_per_m: phase.sampled_results.map((item: any) => item.shear_kN_per_m),
    net_soil_pressure_kPa: phase.sampled_results.map((item: any) => item.net_soil_pressure_kPa),
    water_pressure_kPa: phase.sampled_results.map((item: any) => item.water_pressure_kPa),
    branch_state: phase.sampled_results.map((item: any) => item.branch_state),
    left_branch: phase.sampled_results.map((item: any) => item.left_branch ?? String(item.branch_state ?? "").split("/")[0] ?? "n/a"),
    right_branch: phase.sampled_results.map((item: any) => item.right_branch ?? String(item.branch_state ?? "").split("/")[1] ?? "n/a"),
  })),
};

export const SAMPLE_CONTACT_STATE = {
  projectName: "Basement wall study",
  email: "engineer@example.com",
  message: "Please review the staged excavation response and advise on anchor reserve.",
  consent: true,
};

export type ContactState = {
  projectName: string;
  email: string;
  message: string;
  consent: boolean;
};

type EditorFocusState = {
  segmentIndex?: number;
  leftLayerIndex?: number;
  rightLayerIndex?: number;
  supportIndex?: number;
};

type StructureAction =
  | "phase_duplicate"
  | "phase_remove"
  | "segment_split"
  | "segment_remove"
  | "left_layer_split"
  | "left_layer_remove"
  | "right_layer_split"
  | "right_layer_remove"
  | "support_add"
  | "support_remove";

type StructureActionResult = {
  project: ProjectInput;
  focus: ReturnType<typeof normalizeEditorFocus>;
  previewPhaseIndex?: number;
};

let turnstileScriptPromise: Promise<any> | null = null;

export function resetTurnstileLoaderForTests() {
  turnstileScriptPromise = null;
}

export function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}

function numberOrUndefined(value: string | undefined) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function optionalNumberLabel(
  value: number | undefined,
  digits = 2,
  prefix = "",
  suffix = ""
) {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "";
  }
  return `${prefix}${formatNumber(value, digits)}${suffix}`;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeFileSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "retaining-analysis";
}

export function buildPlotPath(levels: number[], values: number[], width = 360, height = 180) {
  if (!levels.length || !values.length || levels.length !== values.length) {
    return "";
  }
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);
  const maxAbsValue = Math.max(1e-9, ...values.map((value) => Math.abs(value)));
  return values.map((value, index) => {
    const x = ((value + maxAbsValue) / (2 * maxAbsValue)) * width;
    const y = ((maxLevel - levels[index]) / Math.max(1e-9, maxLevel - minLevel)) * height;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function visualizationPhaseForResult(result: any, phaseIndex: number) {
  const phases = result?.visualization?.phases;
  const phase = result?.phases?.[phaseIndex];
  if (!Array.isArray(phases) || !phase) {
    return null;
  }
  const targetPhaseIndex = phase?.phase_index ?? phaseIndex;
  return (
    phases.find((item: any) => item?.phase_index === targetPhaseIndex) ??
    phases.find((item: any) => item?.name === phase.name) ??
    phases[phaseIndex] ??
    null
  );
}

function isPlotArray(value: unknown, expectedLength: number) {
  return Array.isArray(value) && value.length === expectedLength;
}

export type ResultDesignView = "characteristic" | "set1" | "set2";

function resultPhaseForView(result: any, phaseIndex: number, view: ResultDesignView = "characteristic") {
  if (view !== "characteristic" && result?.ec7_verification?.sets) {
    const setResult = result.ec7_verification.sets.find((item: any) => item?.set === view);
    return setResult?.phases?.[phaseIndex] ?? result?.phases?.[phaseIndex];
  }
  return result?.phases?.[phaseIndex];
}

function buildPhasePlotData(result: any, phaseIndex: number, view: ResultDesignView = "characteristic") {
  const phase = resultPhaseForView(result, phaseIndex, view);
  const sampledResults = phase?.sampled_results ?? [];
  const sampled = {
    levels: sampledResults.map((item: any) => item.level_m),
    displacement: sampledResults.map((item: any) => item.displacement_mm),
    rotation: sampledResults.map((item: any) => item.rotation_mrad),
    moment: sampledResults.map((item: any) => item.moment_kNm_per_m),
    shear: sampledResults.map((item: any) => item.shear_kN_per_m),
    pressure: sampledResults.map((item: any) => item.net_soil_pressure_kPa),
    waterPressure: sampledResults.map((item: any) => item.water_pressure_kPa),
    branchState: sampledResults.map((item: any) => item.branch_state),
    source: "sampled_results" as const,
  };
  const visualizationPhase = view === "characteristic" ? visualizationPhaseForResult(result, phaseIndex) : null;
  const expectedLength = visualizationPhase?.levels_m?.length ?? 0;
  if (
    visualizationPhase &&
    expectedLength > 0 &&
    isPlotArray(visualizationPhase.displacement_mm, expectedLength) &&
    isPlotArray(visualizationPhase.rotation_mrad, expectedLength) &&
    isPlotArray(visualizationPhase.moment_kNm_per_m, expectedLength) &&
    isPlotArray(visualizationPhase.shear_kN_per_m, expectedLength) &&
    isPlotArray(visualizationPhase.net_soil_pressure_kPa, expectedLength) &&
    isPlotArray(visualizationPhase.water_pressure_kPa, expectedLength) &&
    isPlotArray(visualizationPhase.branch_state, expectedLength)
  ) {
    return {
      levels: visualizationPhase.levels_m,
      displacement: visualizationPhase.displacement_mm,
      rotation: visualizationPhase.rotation_mrad,
      moment: visualizationPhase.moment_kNm_per_m,
      shear: visualizationPhase.shear_kN_per_m,
      pressure: visualizationPhase.net_soil_pressure_kPa,
      waterPressure: visualizationPhase.water_pressure_kPa,
      branchState: visualizationPhase.branch_state,
      source: "visualization" as const,
    };
  }
  return sampled;
}

/**
 * Shear jumps at every node by the lumped spring/support force (large at
 * anchors and props). When the API returns the shear just above and just
 * below each node, plot it as a stepped diagram; otherwise use the nodal value.
 */
export function buildSteppedShearSeries(result: any, phaseIndex: number, phaseOverride?: any) {
  const visualizationPhase = phaseOverride ? null : visualizationPhaseForResult(result, phaseIndex);
  const sampledResults = phaseOverride?.sampled_results ?? result?.phases?.[phaseIndex]?.sampled_results ?? [];
  const levels: number[] = visualizationPhase?.levels_m ?? sampledResults.map((item: any) => item.level_m);
  const above: unknown = visualizationPhase?.shear_above_kN_per_m ??
    (sampledResults.length ? sampledResults.map((item: any) => item.shear_above_kN_per_m) : undefined);
  const below: unknown = visualizationPhase?.shear_below_kN_per_m ??
    (sampledResults.length ? sampledResults.map((item: any) => item.shear_below_kN_per_m) : undefined);
  const isFiniteSeries = (value: unknown) =>
    isPlotArray(value, levels?.length ?? -1) && (value as unknown[]).every((item) => Number.isFinite(item));
  if (!levels?.length || !isFiniteSeries(above) || !isFiniteSeries(below)) {
    return undefined;
  }
  const aboveValues = above as number[];
  const belowValues = below as number[];
  const steppedLevels: number[] = [];
  const steppedValues: number[] = [];
  levels.forEach((level: number, index: number) => {
    if (index > 0) {
      steppedLevels.push(level);
      steppedValues.push(aboveValues[index]);
    }
    if (index < levels.length - 1) {
      steppedLevels.push(level);
      steppedValues.push(belowValues[index]);
    }
  });
  return { levels: steppedLevels, values: steppedValues };
}

/**
 * Phase to show after a run: the first phase without equilibrium if there is
 * one (the user must see it), otherwise the phase with the governing bending
 * moment, otherwise the last phase.
 */
export function governingPhaseIndex(result: any, phaseCount: number) {
  const phases = result?.phases ?? [];
  const failed = phases.findIndex((phase: any) => phase?.converged === false);
  if (failed >= 0) return Math.min(failed, Math.max(0, phaseCount - 1));
  const governingName = result?.governing?.max_abs_moment_phase;
  const governing = phases.findIndex((phase: any) => phase?.name === governingName);
  const index = governing >= 0 ? governing : phases.length - 1;
  return Math.max(0, Math.min(index, phaseCount - 1));
}

function plotSourceDescription(source: "visualization" | "sampled_results", quantity: string) {
  if (source === "visualization") {
    return `Direct API visualization ${quantity}, without client-side mechanics.`;
  }
  return `Fallback ${quantity} from sampled results because visualization arrays were unavailable.`;
}

export function buildInputSnapshot(project: ProjectInput, phaseIndex = 0) {
  const wallDepth = project.wall_geometry.top_level_m - project.wall_geometry.toe_level_m;
  const leftLayers = project.soil_profiles.left.layers.length;
  const rightLayers = project.soil_profiles.right.layers.length;
  const activeVerticalLoads = project.phases
    .map((phase) => phase.vertical_line_load_kN_per_m ?? 0)
    .filter((value) => Math.abs(value) > 1e-9);
  const primarySegment = project.wall_geometry.segments[0];
  const wallSection = buildWallSectionMetadata(project);
  const segmentStiffnessLabel = primarySegment
    ? `EI ${formatNumber(primarySegment.ei_kNm2_per_m, 0)} kNm2/m`
    : "";
  const segmentCrackedLabel =
    primarySegment?.cracked_ei_kNm2_per_m !== undefined
      ? ` · cracked EI ${formatNumber(primarySegment.cracked_ei_kNm2_per_m, 0)}`
      : "";
  const wallLengthSearch = wallLengthSearchForProject(project);
  const targetElementLengthM = targetElementLengthForProject(project);
  const maxWallDisplacementMm = project.design_options?.max_wall_displacement_mm;
  const supportTypes = [...new Set(project.supports.map((item) => supportTypeLabel(item.type)))];
  const phase = activePhaseForProject(project, phaseIndex);
  const leftLayer = firstSoilLayerForSide(project, "left");
  const rightLayer = firstSoilLayerForSide(project, "right");
  const firstSupport = project.supports[0];
  const firstSupportPhaseWindow = firstSupport
    ? `${(firstSupport.active_from_phase ?? 0) + 1}-${Number.isFinite(firstSupport.active_to_phase ?? Number.POSITIVE_INFINITY) ? (firstSupport.active_to_phase ?? 0) + 1 : "∞"}`
    : "n/a";
  return [
    {
      title: "Wall",
      text: `${project.wall_type.replaceAll("_", " ")} · ${formatNumber(wallDepth, 1)} m embedment · ${project.wall_geometry.segments.length} segment(s) · ${formatNumber(project.wall_geometry.inclination_degrees ?? 0, 1)}° from vertical${project.wall_type === "steel_sheet_pile" ? `${wallSection.value ? ` · ${wallSection.value}` : ""}${segmentStiffnessLabel ? ` · ${segmentStiffnessLabel}${segmentCrackedLabel}` : ""}` : `${wallSection.value ? ` · ${wallSection.value}` : ""}`}`,
    },
    {
      title: "Design mode",
      text: `${project.design_mode.toUpperCase()} · ${project.phases.length} phase(s) · target element length ${formatNumber(targetElementLengthM, 2)} m · max wall displacement (project limit) ${Number.isFinite(maxWallDisplacementMm) ? `${formatNumber(maxWallDisplacementMm as number, 2)} mm` : "not declared"}`,
    },
    {
      title: "Selected phase",
      text: `${phase.name} · surface L/R ${formatNumber(phase.surface_level_left_m ?? project.wall_geometry.top_level_m, 1)} / ${formatNumber(phase.surface_level_right_m ?? project.wall_geometry.top_level_m, 1)} m · excavation L/R ${formatNumber(phase.excavation_level_left_m, 1)} / ${formatNumber(phase.excavation_level_right_m, 1)} m · groundwater L/R ${formatNumber(phase.groundwater_level_left_m, 1)} / ${formatNumber(phase.groundwater_level_right_m, 1)} m · surcharge L/R ${formatNumber(phase.surcharge_left_kPa ?? 0, 1)} / ${formatNumber(phase.surcharge_right_kPa ?? 0, 1)} kPa`,
    },
    {
      title: "Soils",
      text: `${leftLayers} left layer(s), ${rightLayers} right layer(s) · ${buildSoilLayerSummary("L1", leftLayer)} · ${buildSoilLayerSummary("R1", rightLayer)}`,
    },
    {
      title: "Supports",
      text: `${project.supports.length} support item(s), ${project.supports.filter((item) => item.type === "anchor" || item.type === "strut" || item.type === "underwater_concrete_block").length} one-sided support(s) · types ${supportTypes.join(", ")} · first support phase window ${firstSupportPhaseWindow} · max inclination ${formatNumber(Math.max(0, ...project.supports.map((item: any) => item.inclination_degrees ?? 0)), 1)}°`,
    },
    {
      title: "Toe control",
      text: wallLengthSearch
        ? `Search from ${formatNumber(wallLengthSearch.start_toe_level_m, 1)} m to ${formatNumber(wallLengthSearch.minimum_toe_level_m, 1)} m in ${formatNumber(wallLengthSearch.step_m, 2)} m steps · target ${formatNumber(wallLengthSearch.max_head_displacement_mm ?? 60, 1)} mm`
        : `Fixed toe at ${formatNumber(project.wall_geometry.toe_level_m, 1)} m`,
    },
    {
      title: "Vertical wall load",
      text: activeVerticalLoads.length
        ? `${formatNumber(Math.max(...activeVerticalLoads), 1)} kN/m active in selected excavation phases with second-order option`
        : "No vertical wall line load defined",
    },
  ];
}

function buildSteelSectionLabel(section: any) {
  if (!section) {
    return "";
  }
  const libraryLabel = section.library_section_id
    ? STEEL_SHEET_PILE_LIBRARY[section.library_section_id as keyof typeof STEEL_SHEET_PILE_LIBRARY]?.label
    : "";
  return section.section_name || libraryLabel || "manual section";
}

function buildWallSectionMetadata(project: ProjectInput) {
  const segment = project.wall_geometry.segments[0];
  if (project.wall_type === "steel_sheet_pile") {
    return {
      label: "Steel section",
      value: buildSteelSectionLabel(segment?.steel_section) || "manual/direct input",
    };
  }
  const sectionParts = [
    segment?.label || "direct section input",
    segment?.ei_kNm2_per_m !== undefined ? `EI ${formatNumber(segment.ei_kNm2_per_m, 0)} kNm2/m` : "",
    segment?.cracked_ei_kNm2_per_m !== undefined
      ? `cracked EI ${formatNumber(segment.cracked_ei_kNm2_per_m, 0)} kNm2/m`
      : "",
    segment?.cracking_moment_kNm_per_m !== undefined
      ? `Mcr ${formatNumber(segment.cracking_moment_kNm_per_m, 0)} kNm/m`
      : "",
    segment?.moment_resistance_kNm_per_m !== undefined
      ? `Md ${formatNumber(segment.moment_resistance_kNm_per_m, 0)} kNm/m`
      : "",
    segment?.shear_resistance_kN_per_m !== undefined
      ? `Vd ${formatNumber(segment.shear_resistance_kN_per_m, 0)} kN/m`
      : "",
  ].filter(Boolean);
  return {
    label: "Diaphragm section",
    value: sectionParts.join(" · ") || "direct EI/cracked EI resistance input",
  };
}

function steelSectionForProject(project: ProjectInput) {
  const segment = project.wall_geometry.segments[0];
  return segment?.steel_section || {};
}

function wallLengthSearchForProject(project: ProjectInput) {
  return project.design_options?.wall_length_search;
}

function defaultSteelGammaM0(designMode: ProjectInput["design_mode"] | undefined) {
  return designMode === "ec7" ? 1.1 : 1;
}

function ec7PartialFactorsForProject(project: ProjectInput): Required<Ec7PartialFactors> {
  return {
    set1: { ...EC7_PARTIAL_FACTOR_DEFAULTS.set1, ...(project.ec7_partial_factors?.set1 ?? {}) },
    set2: { ...EC7_PARTIAL_FACTOR_DEFAULTS.set2, ...(project.ec7_partial_factors?.set2 ?? {}) },
  };
}

export function resetEc7PartialFactors(project: ProjectInput) {
  return {
    ...structuredClone(project),
    ec7_partial_factors: structuredClone(EC7_PARTIAL_FACTOR_DEFAULTS),
  };
}

const EC7_ACTION_TYPES: Array<{ value: Ec7ActionType; label: string }> = [
  { value: "permanent_unfavourable", label: "Permanent – unfavourable" },
  { value: "permanent_favourable", label: "Permanent – favourable" },
  { value: "variable_unfavourable", label: "Variable – unfavourable" },
  { value: "variable_favourable", label: "Variable – favourable" },
];

function ec7ActionTypeSelect(attribute: string, selected?: Ec7ActionType) {
  const value = selected ?? "variable_unfavourable";
  return `<select ${attribute} aria-label="${attribute.replaceAll("data-qe-", "").replaceAll("-", " ")}">${EC7_ACTION_TYPES.map((item) => `<option value="${item.value}" ${item.value === value ? "selected" : ""}>${item.label}</option>`).join("")}</select>`;
}

export function ec7FactorEditorValuesToState(values: { set1: Record<string, number>; set2: Record<string, number> }) {
  const state = structuredClone(values);
  for (const setName of ["set1", "set2"] as const) {
    if (typeof state[setName].overdig_fraction === "number") {
      state[setName].overdig_fraction /= 100;
    }
  }
  return state;
}

function readEc7FactorInputs(root: ParentNode) {
  const factors: { set1: Record<string, number>; set2: Record<string, number> } = { set1: {}, set2: {} };
  root.querySelectorAll<HTMLInputElement>("[data-qe-ec7-factor]").forEach((input) => {
    const [setName, fieldName] = (input.dataset.qeEc7Factor ?? "").split(".");
    const value = numberOrUndefined(input.value);
    if ((setName === "set1" || setName === "set2") && fieldName && value !== undefined) {
      factors[setName][fieldName] = value;
    }
  });
  return ec7FactorEditorValuesToState(factors);
}

function ec7FactorBlock(project: ProjectInput) {
  if (project.design_mode !== "ec7") return "";
  const factors = ec7PartialFactorsForProject(project);
  const rows: Array<{ key: keyof typeof EC7_PARTIAL_FACTOR_DEFAULTS.set1; label: string; percent?: boolean }> = [
    { key: "permanent_unfavourable", label: "Permanent load, unfavourable (×)" },
    { key: "permanent_favourable", label: "Permanent load, favourable (×)" },
    { key: "variable_unfavourable", label: "Variable load, unfavourable (×)" },
    { key: "variable_favourable", label: "Variable load, favourable (×)" },
    { key: "tan_phi", label: "tan φ′ (÷)" },
    { key: "cohesion", label: "Cohesion (÷)" },
    { key: "subgrade_modulus", label: "Subgrade modulus (÷)" },
    { key: "effect", label: "Factor on effects M, V, support forces (×)" },
    { key: "overdig_fraction", label: "Overdig (% of H)", percent: true },
    { key: "overdig_max_m", label: "Overdig maximum (m)" },
  ];
  const inputs = (setName: "set1" | "set2", field: keyof typeof EC7_PARTIAL_FACTOR_DEFAULTS.set1, percent = false) => {
    const value = factors[setName][field];
    const shown = percent ? value * 100 : value;
    const readableSet = setName === "set1" ? "Set 1" : "Set 2";
    return `<label class="ec7-factor-input"><span class="sr-only">${readableSet} ${field.replaceAll("_", " ")}</span><input type="number" step="any" data-qe-ec7-factor="${setName}.${field}" aria-label="${readableSet} ${field.replaceAll("_", " ")}" value="${escapeHtml(shown)}"></label>`;
  };
  return `
    <section class="ec7-factor-block" data-qe-ec7-factors aria-labelledby="ec7-factor-title">
      <h3 id="ec7-factor-title">Partial factors (EC7-BE, design approach 1)</h3>
      <div class="table-shell ec7-factor-table-shell">
        <table class="ec7-factor-table"><thead><tr><th>Factor</th><th>Set 1</th><th>Set 2</th></tr></thead>
          <tbody>${rows.map((row) => `<tr><th scope="row">${row.label}</th><td>${inputs("set1", row.key, row.percent)}</td><td>${inputs("set2", row.key, row.percent)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-ec7-reset>Reset to defaults</button></div>
      <p class="quick-editor-note">Default values for EC7-BE (design approach 1). Every factor can be changed; the engineer remains responsible for the partial factors.</p>
    </section>`;
}

function soilTopLevel(project: ProjectInput, phase: PhaseInput, side: "left" | "right") {
  const surface = phase[`surface_level_${side}_m`] ?? project.wall_geometry.top_level_m;
  const excavation = phase[`excavation_level_${side}_m`];
  return Math.min(surface, excavation);
}

export function normalizeCulmannProfiles(project: ProjectInput): ProjectInput {
  const normalized = structuredClone(project);
  for (const phase of normalized.phases) {
    for (const side of ["left", "right"] as const) {
      const profileKey = `surface_profile_${side}_m` as const;
      const profile = phase[profileKey];
      if (Array.isArray(profile) && profile.length) {
        profile[0] = [0, soilTopLevel(normalized, phase, side)];
      }
    }
  }
  return normalized;
}

export function validateEarthPressureInput(project: ProjectInput) {
  if ((project.earth_pressure_method ?? "coulomb") !== "culmann") return [];
  const errors: string[] = [];
  project.phases.forEach((phase, phaseIndex) => {
    for (const side of ["left", "right"] as const) {
      const profile = phase[`surface_profile_${side}_m`];
      if (profile?.length) {
        let previousDistance = -Infinity;
        profile.forEach((point, pointIndex) => {
          const distance = point?.[0];
          const level = point?.[1];
          if (typeof distance !== "number" || !Number.isFinite(distance) || typeof level !== "number" || !Number.isFinite(level)) {
            errors.push(`Phase ${phaseIndex + 1} ${side} surface profile row ${pointIndex + 1} needs a distance and level.`);
          } else {
            if (pointIndex === 0 && Math.abs(distance) > 1e-9) {
              errors.push(`Phase ${phaseIndex + 1} ${side} surface profile must start at distance 0 m.`);
            }
            if (distance <= previousDistance) {
              errors.push(`Phase ${phaseIndex + 1} ${side} surface profile distances must be strictly increasing.`);
            }
            previousDistance = distance;
          }
        });
      }
      const strips = phase[`strip_surcharges_${side}`] ?? [];
      if (strips.length > 10) {
        errors.push(`Phase ${phaseIndex + 1} ${side} supports at most 10 strip surcharges.`);
      }
      strips.forEach((strip, stripIndex) => {
        if (!Array.isArray(strip.points) || strip.points.length === 0) {
          errors.push(`Phase ${phaseIndex + 1} ${side} strip ${stripIndex + 1} is empty; add at least one distance and load point.`);
          return;
        }
        let previousDistance = -Infinity;
        strip.points.forEach((point, pointIndex) => {
          const distance = point?.[0];
          const load = point?.[1];
          if (typeof distance !== "number" || !Number.isFinite(distance) || typeof load !== "number" || !Number.isFinite(load)) {
            errors.push(`Phase ${phaseIndex + 1} ${side} strip ${stripIndex + 1} row ${pointIndex + 1} needs a distance and load.`);
          } else {
            if (distance < previousDistance) {
              errors.push(`Phase ${phaseIndex + 1} ${side} strip ${stripIndex + 1} distances must not decrease.`);
            }
            previousDistance = distance;
          }
        });
      });
    }
  });
  return errors;
}

export function applyCulmannStructureAction(
  project: ProjectInput,
  phaseIndex: number,
  action: "profile_add" | "profile_remove" | "strip_add" | "strip_remove" | "strip_point_add" | "strip_point_remove",
  side: "left" | "right",
  stripIndex = 0,
  rowIndex = 0
) {
  const nextProject = normalizeCulmannProfiles(project);
  const phase = nextProject.phases[phaseIndex];
  if (!phase) return nextProject;
  const profileKey = `surface_profile_${side}_m` as const;
  const stripKey = `strip_surcharges_${side}` as const;
  if (action.startsWith("profile_")) {
    const profile = phase[profileKey] ?? [[0, soilTopLevel(nextProject, phase, side)] as CulmannPoint];
    if (action === "profile_add" && profile.length < 50) {
      const last = profile[profile.length - 1] ?? [0, soilTopLevel(nextProject, phase, side)];
      profile.push([typeof last[0] === "number" ? last[0] + 5 : 5, last[1]]);
    } else if (action === "profile_remove" && rowIndex > 0) {
      profile.splice(rowIndex, 1);
    }
    phase[profileKey] = profile;
    return nextProject;
  }

  const strips = phase[stripKey] ?? [];
  if (action === "strip_add" && strips.length < 10) {
    strips.push({ points: [] });
  } else if (action === "strip_remove") {
    strips.splice(stripIndex, 1);
  } else if (strips[stripIndex]) {
    if (action === "strip_point_add" && strips[stripIndex].points.length < 50) {
      strips[stripIndex].points.push([null, null]);
    } else if (action === "strip_point_remove") {
      strips[stripIndex].points.splice(rowIndex, 1);
    }
  }
  phase[stripKey] = strips;
  return nextProject;
}

export function buildAnalysisPayload(project: ProjectInput): ProjectInput {
  const payload = normalizeCulmannProfiles(project);
  if ((payload.earth_pressure_method ?? "coulomb") === "culmann") {
    payload.earth_pressure_method = "culmann";
    if (payload.wall_friction_cap === "phi_over_3" || !payload.wall_friction_cap) {
      delete payload.wall_friction_cap;
    }
    payload.phases = payload.phases.map((phase) => {
      const nextPhase = { ...phase };
      if (payload.design_mode === "ec7") {
        nextPhase.strip_surcharges_left = nextPhase.strip_surcharges_left?.map((strip) => ({
          ...strip,
          action: strip.action ?? "variable_unfavourable",
        }));
        nextPhase.strip_surcharges_right = nextPhase.strip_surcharges_right?.map((strip) => ({
          ...strip,
          action: strip.action ?? "variable_unfavourable",
        }));
      } else {
        nextPhase.strip_surcharges_left = nextPhase.strip_surcharges_left?.map(({ action: _action, ...strip }) => strip);
        nextPhase.strip_surcharges_right = nextPhase.strip_surcharges_right?.map(({ action: _action, ...strip }) => strip);
      }
      return nextPhase;
    });
  } else {
    delete payload.earth_pressure_method;
    if (payload.wall_friction_cap === "phi_over_3" || !payload.wall_friction_cap) {
      delete payload.wall_friction_cap;
    }
    payload.phases = payload.phases.map((phase) => {
      const nextPhase = { ...phase };
      delete nextPhase.surface_profile_left_m;
      delete nextPhase.surface_profile_right_m;
      delete nextPhase.strip_surcharges_left;
      delete nextPhase.strip_surcharges_right;
      return nextPhase;
    });
  }
  if (payload.wall_friction_cap === "phi_over_3") delete payload.wall_friction_cap;
  if (payload.design_mode !== "ec7") {
    delete payload.ec7_partial_factors;
    payload.phases = payload.phases.map((phase) => {
      const cleanPhase = { ...phase };
      delete cleanPhase.surcharge_left_action;
      delete cleanPhase.surcharge_right_action;
      delete cleanPhase.vertical_line_load_action;
      return cleanPhase;
    });
    payload.supports = payload.supports.map((support) => {
      const cleanSupport = { ...support };
      delete cleanSupport.action_type;
      return cleanSupport;
    });
  } else {
    payload.ec7_partial_factors = ec7PartialFactorsForProject(payload);
    payload.phases = payload.phases.map((phase) => ({
      ...phase,
      surcharge_left_action: phase.surcharge_left_action ?? "variable_unfavourable",
      surcharge_right_action: phase.surcharge_right_action ?? "variable_unfavourable",
      vertical_line_load_action: phase.vertical_line_load_action ?? "permanent_unfavourable",
    }));
    payload.supports = payload.supports.map((support) => {
      const nextSupport = { ...support };
      if (nextSupport.type === "point_load" || nextSupport.type === "moment") {
        nextSupport.action_type = nextSupport.action_type ?? "variable_unfavourable";
      } else {
        delete nextSupport.action_type;
      }
      return nextSupport;
    });
  }
  if (payload.wall_type === "diaphragm_wall") {
    payload.wall_geometry.segments = payload.wall_geometry.segments.map((segment) => {
      const { steel_section: _steelSection, ...diaphragmSegment } = segment;
      return diaphragmSegment;
    });
  }
  return payload;
}

function targetElementLengthForProject(project: ProjectInput | undefined) {
  return project?.design_options?.target_element_length_m ?? 0.5;
}

function targetElementLengthForResult(result: any) {
  return result?.normalized_input?.design_options?.target_element_length_m ?? 0.5;
}

function isDisplayProjectCandidate(value: any): value is ProjectInput {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof value.wall_type === "string" &&
    typeof value.design_mode === "string" &&
    value.wall_geometry &&
    Array.isArray(value.wall_geometry.segments) &&
    Array.isArray(value.phases) &&
    value.soil_profiles?.left &&
    Array.isArray(value.soil_profiles.left.layers) &&
    value.soil_profiles?.right &&
    Array.isArray(value.soil_profiles.right.layers) &&
    Array.isArray(value.supports)
  );
}

export function readStoredProject(storage?: Pick<Storage, "getItem">): ProjectInput | null {
  try {
    const value = JSON.parse((storage ?? globalThis.localStorage).getItem(PROJECT_STORAGE_KEY) || "null");
    return isDisplayProjectCandidate(value) ? normalizeCulmannProfiles(value) : null;
  } catch {
    return null;
  }
}

export function persistStoredProject(project: ProjectInput, storage?: Pick<Storage, "setItem">) {
  try {
    (storage ?? globalThis.localStorage).setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
  } catch {
    // The editor remains usable when browser storage is unavailable.
  }
}

export function resolveAnalyzedProject(project: ProjectInput, result: any) {
  return isDisplayProjectCandidate(result?.normalized_input)
    ? result.normalized_input
    : project;
}

function buildDiscretizationSummary(result: any) {
  const targetElementLengthM = targetElementLengthForResult(result);
  const nodeLevels = result?.discretization?.node_levels_m;
  const elementLengths = result?.discretization?.element_lengths_m;
  if (!Array.isArray(nodeLevels) || !Array.isArray(elementLengths) || !nodeLevels.length || !elementLengths.length) {
    return `Target element length ${formatNumber(targetElementLengthM, 2)} m · discretization metadata unavailable`;
  }
  const minElementLength = Math.min(...elementLengths);
  const maxElementLength = Math.max(...elementLengths);
  return `Target element length ${formatNumber(targetElementLengthM, 2)} m · ${nodeLevels.length} nodes · ${elementLengths.length} elements · element range ${formatNumber(minElementLength, 2)}-${formatNumber(maxElementLength, 2)} m`;
}

function buildDiscretizationRows(result: any) {
  const nodeLevels = result?.discretization?.node_levels_m;
  const elementLengths = result?.discretization?.element_lengths_m;
  if (!Array.isArray(nodeLevels) || !nodeLevels.length) {
    return `<tr><td colspan="3">No discretization metadata returned.</td></tr>`;
  }
  return nodeLevels.map((level: number, index: number) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(formatNumber(level, 2))}</td>
      <td>${index < (elementLengths?.length ?? 0) ? `${escapeHtml(formatNumber(elementLengths[index], 2))} m` : "n/a"}</td>
    </tr>
  `).join("");
}

function supportTypeLabel(type: SupportInput["type"]) {
  return type.replaceAll("_", " ");
}

function firstSoilLayerForSide(project: ProjectInput, side: "left" | "right") {
  return project.soil_profiles[side].layers[0];
}

function buildSoilLayerSummary(sideLabel: string, layer: SoilLayerInput | undefined) {
  if (!layer) {
    return `${sideLabel}: none`;
  }
  const overrides = [
    optionalNumberLabel(layer.at_rest_coefficient, 2, "K0 "),
    optionalNumberLabel(layer.active_coefficient, 2, "Ka "),
    optionalNumberLabel(layer.passive_coefficient, 2, "Kp "),
    optionalNumberLabel(layer.pore_pressure_offset_kPa, 1, "Δu ", " kPa"),
  ].filter(Boolean);
  const beddingSummary =
    layer.bedding_model === "tri_linear" &&
    layer.tri_linear_displacement_breakpoints_mm &&
    layer.tri_linear_stiffness_factors
      ? `tri-linear ${layer.tri_linear_displacement_breakpoints_mm.map((value) => formatNumber(value, 1)).join("/")} mm · k ${layer.tri_linear_stiffness_factors.map((value) => formatNumber(value, 2)).join("/")}`
      : "linear bedding";
  return [
    `${sideLabel}: φ ${formatNumber(layer.friction_angle_deg, 1)}°`,
    `c ${formatNumber(layer.cohesion_kPa ?? 0, 1)} kPa`,
    `γd ${formatNumber(layer.unit_weight_dry_kN_m3, 1)}`,
    `γw ${formatNumber(layer.unit_weight_wet_kN_m3, 1)}`,
    `ks ${formatNumber(layer.subgrade_modulus_kN_m3, 0)}`,
    beddingSummary,
    optionalNumberLabel(layer.wall_friction_deg, 1, "δ ", "°"),
    overrides.length ? overrides.join(", ") : "",
  ].filter(Boolean).join(" · ");
}

export function buildProjectPhaseOptions(project: ProjectInput) {
  return project.phases.map((phase, index) => ({
    index,
    label: `${index + 1}. ${phase.name}`,
  }));
}

export function buildPhaseOptions(result: any) {
  return result.phases.map((phase: any, index: number) => ({
    index,
    label: `${index + 1}. ${phase.name}`,
  }));
}

function clampIndex(value: number | undefined, length: number) {
  if (!length) {
    return 0;
  }
  const normalized = Number.isFinite(value) ? Math.round(value as number) : 0;
  return Math.max(0, Math.min(length - 1, normalized));
}

function normalizeEditorFocus(project: ProjectInput, focus: EditorFocusState = {}) {
  return {
    segmentIndex: clampIndex(focus.segmentIndex, project.wall_geometry.segments.length),
    leftLayerIndex: clampIndex(focus.leftLayerIndex, project.soil_profiles.left.layers.length),
    rightLayerIndex: clampIndex(focus.rightLayerIndex, project.soil_profiles.right.layers.length),
    supportIndex: clampIndex(focus.supportIndex, project.supports.length),
  };
}

function midpointLevel(topLevelM: number, bottomLevelM: number) {
  return (topLevelM + bottomLevelM) / 2;
}

function nextSupportId(existingSupports: SupportInput[], baseId = "S") {
  const existing = new Set(existingSupports.map((support) => support.id));
  let candidateIndex = existingSupports.length + 1;
  let candidate = `${baseId}${candidateIndex}`;
  while (existing.has(candidate)) {
    candidateIndex += 1;
    candidate = `${baseId}${candidateIndex}`;
  }
  return candidate;
}

function mapFiniteSupportWindow(
  support: SupportInput,
  phaseCount: number,
  transform: (phaseIndex: number) => number | null
) {
  const start = Math.max(0, Math.min(phaseCount - 1, support.active_from_phase ?? 0));
  const end = support.active_to_phase === undefined
    ? start
    : Math.max(start, Math.min(phaseCount - 1, support.active_to_phase));
  const mapped = new Set<number>();
  for (let phaseIndex = start; phaseIndex <= end; phaseIndex += 1) {
    const transformed = transform(phaseIndex);
    if (transformed !== null) {
      mapped.add(transformed);
    }
  }
  return [...mapped].sort((left, right) => left - right);
}

function shiftSupportsForPhaseInsert(supports: SupportInput[], selectedPhaseIndex: number, phaseCountBeforeInsert: number) {
  const insertIndex = selectedPhaseIndex + 1;
  for (const support of supports) {
    if (support.active_to_phase === undefined) {
      if ((support.active_from_phase ?? 0) > selectedPhaseIndex) {
        support.active_from_phase = (support.active_from_phase ?? 0) + 1;
      }
      continue;
    }
    const mapped = mapFiniteSupportWindow(
      support,
      phaseCountBeforeInsert,
      (phaseIndex) => {
        if (phaseIndex > selectedPhaseIndex) {
          return phaseIndex + 1;
        }
        if (phaseIndex === selectedPhaseIndex) {
          return phaseIndex;
        }
        return phaseIndex;
      }
    );
    if (mapped.includes(selectedPhaseIndex)) {
      mapped.push(insertIndex);
    }
    const normalized = [...new Set(mapped)].sort((left, right) => left - right);
    support.active_from_phase = normalized[0];
    support.active_to_phase = normalized[normalized.length - 1];
  }
}

function shiftSupportsForPhaseRemoval(supports: SupportInput[], removedPhaseIndex: number, phaseCountBeforeRemoval: number, phaseCountAfterRemoval: number) {
  const lastPhaseIndex = Math.max(0, phaseCountAfterRemoval - 1);
  for (const support of supports) {
    if (support.active_to_phase === undefined) {
      const start = support.active_from_phase ?? 0;
      if (start > removedPhaseIndex) {
        support.active_from_phase = start - 1;
      } else {
        support.active_from_phase = Math.min(start, lastPhaseIndex);
      }
      continue;
    }
    const mapped = mapFiniteSupportWindow(
      support,
      phaseCountBeforeRemoval,
      (phaseIndex) => {
        if (phaseIndex === removedPhaseIndex) {
          return null;
        }
        return phaseIndex > removedPhaseIndex ? phaseIndex - 1 : phaseIndex;
      }
    );
    if (!mapped.length) {
      const survivorPhaseIndex = Math.min(removedPhaseIndex, lastPhaseIndex);
      support.active_from_phase = survivorPhaseIndex;
      support.active_to_phase = survivorPhaseIndex;
      continue;
    }
    support.active_from_phase = mapped[0];
    support.active_to_phase = mapped[mapped.length - 1];
  }
}

export function applyQuickEditorStructureAction(
  project: ProjectInput,
  focus: EditorFocusState = {},
  action: StructureAction,
  phaseIndex = 0
): StructureActionResult {
  const nextProject = structuredClone(project);
  const focusState = normalizeEditorFocus(nextProject, focus);

  if (action === "phase_duplicate") {
    const selectedPhaseIndex = Math.max(0, Math.min(nextProject.phases.length - 1, phaseIndex));
    const sourcePhase = nextProject.phases[selectedPhaseIndex];
    const duplicatedPhase = structuredClone(sourcePhase);
    duplicatedPhase.name = `${sourcePhase.name} copy`;
    const phaseCountBeforeInsert = nextProject.phases.length;
    nextProject.phases.splice(selectedPhaseIndex + 1, 0, duplicatedPhase);
    shiftSupportsForPhaseInsert(nextProject.supports, selectedPhaseIndex, phaseCountBeforeInsert);
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, focusState),
      previewPhaseIndex: selectedPhaseIndex + 1,
    };
  }

  if (action === "phase_remove" && nextProject.phases.length > 1) {
    const removedPhaseIndex = Math.max(0, Math.min(nextProject.phases.length - 1, phaseIndex));
    const phaseCountBeforeRemoval = nextProject.phases.length;
    nextProject.phases.splice(removedPhaseIndex, 1);
    shiftSupportsForPhaseRemoval(
      nextProject.supports,
      removedPhaseIndex,
      phaseCountBeforeRemoval,
      nextProject.phases.length
    );
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, focusState),
      previewPhaseIndex: Math.max(0, Math.min(removedPhaseIndex, nextProject.phases.length - 1)),
    };
  }

  if (action === "segment_split") {
    const segment = nextProject.wall_geometry.segments[focusState.segmentIndex];
    if (segment && Math.abs(segment.top_level_m - segment.bottom_level_m) > 1e-9) {
      const splitLevelM = midpointLevel(segment.top_level_m, segment.bottom_level_m);
      const upper = {
        ...structuredClone(segment),
        label: segment.label ? `${segment.label} upper` : `Segment ${focusState.segmentIndex + 1} upper`,
        bottom_level_m: splitLevelM,
      };
      const lower = {
        ...structuredClone(segment),
        label: segment.label ? `${segment.label} lower` : `Segment ${focusState.segmentIndex + 1} lower`,
        top_level_m: splitLevelM,
      };
      nextProject.wall_geometry.segments.splice(focusState.segmentIndex, 1, upper, lower);
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, {
        ...focusState,
        segmentIndex: focusState.segmentIndex + 1,
      }),
      previewPhaseIndex: undefined,
    };
  }
  }

  if (action === "segment_remove" && nextProject.wall_geometry.segments.length > 1) {
    const removed = nextProject.wall_geometry.segments[focusState.segmentIndex];
    if (focusState.segmentIndex === 0) {
      nextProject.wall_geometry.segments[1].top_level_m = removed.top_level_m;
    } else {
      nextProject.wall_geometry.segments[focusState.segmentIndex - 1].bottom_level_m = removed.bottom_level_m;
    }
    nextProject.wall_geometry.segments.splice(focusState.segmentIndex, 1);
    nextProject.wall_geometry.top_level_m = nextProject.wall_geometry.segments[0].top_level_m;
    nextProject.wall_geometry.toe_level_m =
      nextProject.wall_geometry.segments[nextProject.wall_geometry.segments.length - 1].bottom_level_m;
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, {
        ...focusState,
        segmentIndex: Math.max(0, focusState.segmentIndex - (focusState.segmentIndex === nextProject.wall_geometry.segments.length ? 1 : 0)),
      }),
      previewPhaseIndex: undefined,
    };
  }

  const splitLayer = (side: "left" | "right") => {
    const layers = nextProject.soil_profiles[side].layers;
    const layerIndex = side === "left" ? focusState.leftLayerIndex : focusState.rightLayerIndex;
    const layer = layers[layerIndex];
    if (layer && Math.abs(layer.top_level_m - layer.bottom_level_m) > 1e-9) {
      const splitLevelM = midpointLevel(layer.top_level_m, layer.bottom_level_m);
      const upper = {
        ...structuredClone(layer),
        bottom_level_m: splitLevelM,
      };
      const lower = {
        ...structuredClone(layer),
        top_level_m: splitLevelM,
      };
      layers.splice(layerIndex, 1, upper, lower);
      return {
        project: nextProject,
        focus: normalizeEditorFocus(nextProject, side === "left"
          ? { ...focusState, leftLayerIndex: layerIndex + 1 }
          : { ...focusState, rightLayerIndex: layerIndex + 1 }),
        previewPhaseIndex: undefined,
      };
    }
    return null;
  };

  if (action === "left_layer_split") {
    return splitLayer("left") ?? { project: nextProject, focus: focusState };
  }
  if (action === "right_layer_split") {
    return splitLayer("right") ?? { project: nextProject, focus: focusState };
  }

  const removeLayer = (side: "left" | "right") => {
    const layers = nextProject.soil_profiles[side].layers;
    const layerIndex = side === "left" ? focusState.leftLayerIndex : focusState.rightLayerIndex;
    if (layers.length <= 1) {
      return null;
    }
    const removed = layers[layerIndex];
    if (layerIndex === 0) {
      layers[1].top_level_m = removed.top_level_m;
    } else {
      layers[layerIndex - 1].bottom_level_m = removed.bottom_level_m;
    }
    layers.splice(layerIndex, 1);
      return {
        project: nextProject,
        focus: normalizeEditorFocus(nextProject, side === "left"
          ? { ...focusState, leftLayerIndex: Math.max(0, layerIndex - (layerIndex === layers.length ? 1 : 0)) }
          : { ...focusState, rightLayerIndex: Math.max(0, layerIndex - (layerIndex === layers.length ? 1 : 0)) }),
        previewPhaseIndex: undefined,
      };
  };

  if (action === "left_layer_remove") {
    return removeLayer("left") ?? { project: nextProject, focus: focusState };
  }
  if (action === "right_layer_remove") {
    return removeLayer("right") ?? { project: nextProject, focus: focusState };
  }

  if (action === "support_add") {
    const source = nextProject.supports[focusState.supportIndex] ?? {
      id: nextSupportId(nextProject.supports),
      type: "anchor" as const,
      depth_m: 2,
      side: "right" as const,
      stiffness_kN_per_m: 5000,
      active_from_phase: 0,
    };
    const clonedSupport = structuredClone(source);
    clonedSupport.id = nextSupportId(nextProject.supports, source.id.replace(/\d+$/, "") || "S");
    clonedSupport.depth_m = Number((clonedSupport.depth_m + 0.5).toFixed(2));
    nextProject.supports.splice(Math.min(focusState.supportIndex + 1, nextProject.supports.length), 0, clonedSupport);
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, {
        ...focusState,
        supportIndex: Math.min(focusState.supportIndex + 1, nextProject.supports.length - 1),
      }),
      previewPhaseIndex: undefined,
    };
  }

  if (action === "support_remove" && nextProject.supports.length) {
    nextProject.supports.splice(focusState.supportIndex, 1);
    return {
      project: nextProject,
      focus: normalizeEditorFocus(nextProject, {
        ...focusState,
        supportIndex: Math.max(0, focusState.supportIndex - (focusState.supportIndex === nextProject.supports.length ? 1 : 0)),
      }),
      previewPhaseIndex: undefined,
    };
  }

  return {
    project: nextProject,
    focus: focusState,
    previewPhaseIndex: undefined,
  };
}

function activePhaseForProject(project: ProjectInput, phaseIndex: number) {
  return project.phases[Math.max(0, Math.min(project.phases.length - 1, phaseIndex))];
}

export function buildGeometryPreviewSvg(project: ProjectInput, phaseIndex = 0) {
  project = normalizeCulmannProfiles(project);
  const phase = activePhaseForProject(project, phaseIndex);
  const showCulmannGeometry = (project.earth_pressure_method ?? "coulomb") === "culmann";
  const wallTop = project.wall_geometry.top_level_m;
  const wallToe = project.wall_geometry.toe_level_m;
  const leftSurfaceLevel = phase.surface_level_left_m ?? wallTop;
  const rightSurfaceLevel = phase.surface_level_right_m ?? wallTop;
  const leftSoilTop = soilTopLevel(project, phase, "left");
  const rightSoilTop = soilTopLevel(project, phase, "right");
  const leftSurfaceProfile = phase.surface_profile_left_m?.length
    ? phase.surface_profile_left_m
    : [[0, leftSoilTop] as CulmannPoint];
  const rightSurfaceProfile = phase.surface_profile_right_m?.length
    ? phase.surface_profile_right_m
    : [[0, rightSoilTop] as CulmannPoint];
  const culmannProfileLevels = showCulmannGeometry
    ? [...leftSurfaceProfile, ...rightSurfaceProfile].map((point) => point[1]).filter((level): level is number => typeof level === "number" && Number.isFinite(level))
    : [];
  const minLevel = Math.min(
    wallToe,
    ...project.soil_profiles.left.layers.map((layer) => layer.bottom_level_m),
    ...project.soil_profiles.right.layers.map((layer) => layer.bottom_level_m)
  );
  const maxLevel = Math.max(wallTop, leftSurfaceLevel, rightSurfaceLevel, ...culmannProfileLevels);
  const width = 640;
  const height = 1040;
  const topPad = 36;
  const bottomPad = 24;
  const leftSoilX = 118;
  const wallX = 320;
  const rightSoilX = 522;
  const soilWidth = 164;
  const inclinationTan = Math.tan(((project.wall_geometry.inclination_degrees ?? 0) * Math.PI) / 180);
  const wallBottomX = wallX + inclinationTan * (height - topPad - bottomPad) * 0.18;
  const scaleY = (levelM: number) =>
    topPad + ((maxLevel - levelM) / Math.max(1e-9, maxLevel - minLevel)) * (height - topPad - bottomPad);
  const wallAxisX = (levelM: number) => {
    const y = scaleY(levelM);
    const normalized = (y - topPad) / Math.max(1e-9, height - topPad - bottomPad);
    return wallX + (wallBottomX - wallX) * normalized;
  };

  const layerCaption = (layer: SoilLayerInput) => {
    const namedLayer = (layer as any).name || (layer as any).label;
    return namedLayer
      ? String(namedLayer)
      : `φ ${formatNumber(layer.friction_angle_deg, 0)}° · γ ${formatNumber(layer.unit_weight_wet_kN_m3, 1)}`;
  };
  const leftSoils = project.soil_profiles.left.layers.map((layer, index) => {
    const yTop = scaleY(layer.top_level_m);
    const yBottom = scaleY(layer.bottom_level_m);
    const rectHeight = Math.max(2, yBottom - yTop);
    return `<rect x="${leftSoilX}" y="${yTop.toFixed(1)}" width="${soilWidth}" height="${rectHeight.toFixed(1)}" fill="${index % 2 === 0 ? "#d8c3aa" : "#c7b097"}" stroke="#a58e73" stroke-width="1"></rect>${rectHeight > 30 ? `<text x="${leftSoilX + soilWidth / 2}" y="${((yTop + yBottom) / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="600" fill="#493b2c">${escapeHtml(layerCaption(layer))}</text>` : ""}`;
  }).join("");
  const rightSoils = project.soil_profiles.right.layers.map((layer, index) => {
    const yTop = scaleY(layer.top_level_m);
    const yBottom = scaleY(layer.bottom_level_m);
    const rectHeight = Math.max(2, yBottom - yTop);
    return `<rect x="${(rightSoilX - soilWidth).toFixed(1)}" y="${yTop.toFixed(1)}" width="${soilWidth}" height="${rectHeight.toFixed(1)}" fill="${index % 2 === 0 ? "#ceb693" : "#b89d78"}" stroke="#a58e73" stroke-width="1"></rect>${rectHeight > 30 ? `<text x="${rightSoilX - soilWidth / 2}" y="${((yTop + yBottom) / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="600" fill="#493b2c">${escapeHtml(layerCaption(layer))}</text>` : ""}`;
  }).join("");

  const leftExcavationY = scaleY(phase.excavation_level_left_m);
  const rightExcavationY = scaleY(phase.excavation_level_right_m);
  const leftSurfaceY = scaleY(leftSurfaceLevel);
  const rightSurfaceY = scaleY(rightSurfaceLevel);
  const leftWaterY = scaleY(phase.groundwater_level_left_m);
  const rightWaterY = scaleY(phase.groundwater_level_right_m);
  const wallSegments = project.wall_geometry.segments.map((segment) => {
    const yTop = scaleY(segment.top_level_m);
    const yBottom = scaleY(segment.bottom_level_m);
    return `<line x1="${wallAxisX(segment.top_level_m).toFixed(1)}" y1="${yTop.toFixed(1)}" x2="${wallAxisX(segment.bottom_level_m).toFixed(1)}" y2="${yBottom.toFixed(1)}" stroke="#23495a" stroke-width="9"></line><circle cx="${wallAxisX(segment.top_level_m).toFixed(1)}" cy="${yTop.toFixed(1)}" r="5" fill="#fff" stroke="#23495a" stroke-width="3"></circle><circle cx="${wallAxisX(segment.bottom_level_m).toFixed(1)}" cy="${yBottom.toFixed(1)}" r="5" fill="#fff" stroke="#23495a" stroke-width="3"></circle>`;
  }).join("");

  const activeSupports = project.supports.filter((support) => {
    const supportStartPhase = (support as any).active_from_phase ?? 0;
    const supportEndPhase = (support as any).active_to_phase ?? Number.POSITIVE_INFINITY;
    return phaseIndex >= supportStartPhase && phaseIndex <= supportEndPhase;
  });

  const supports = activeSupports
    .map((support) => {
      const y = scaleY(project.wall_geometry.top_level_m - support.depth_m);
      const supportWallX = wallAxisX(project.wall_geometry.top_level_m - support.depth_m);
      const supportSide = support.side ?? "right";
      const supportColor = supportSide === "left" ? "#8b5e00" : "#0b6e4f";
      const supportLabel = `${support.id} ${supportTypeLabel(support.type)}`;
      const angle = ((support.inclination_degrees ?? 0) * Math.PI) / 180;
      const length = 64;
      const dx = Math.cos(angle) * length * (supportSide === "left" ? -1 : 1);
      const dy = Math.sin(angle) * length;
      const targetX = supportSide === "left" ? Math.max(leftSoilX + 8, supportWallX + dx) : Math.min(rightSoilX - 8, supportWallX + dx);
      const targetY = y + dy;
      if (support.type === "anchor" || support.type === "strut") {
        return [
          `<line x1="${supportWallX.toFixed(1)}" y1="${y.toFixed(1)}" x2="${targetX.toFixed(1)}" y2="${targetY.toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          `<circle cx="${targetX.toFixed(1)}" cy="${targetY.toFixed(1)}" r="6" fill="${supportColor}"></circle>`,
          `<text x="${(targetX + (supportSide === "left" ? -9 : 9)).toFixed(1)}" y="${(targetY - 10).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="${supportSide === "left" ? "end" : "start"}">${escapeHtml(supportLabel)}</text>`,
        ].join("");
      }
      if (support.type === "spring") {
        return [
          `<line x1="${supportWallX.toFixed(1)}" y1="${y.toFixed(1)}" x2="${targetX.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${supportColor}" stroke-width="3" stroke-dasharray="5 5"></line>`,
          `<rect x="${(targetX - 6).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="12" height="12" fill="${supportColor}" rx="2"></rect>`,
          `<text x="${(targetX + (supportSide === "left" ? -9 : 9)).toFixed(1)}" y="${(y - 10).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="${supportSide === "left" ? "end" : "start"}">${escapeHtml(supportLabel)}</text>`,
        ].join("");
      }
      if (support.type === "underwater_concrete_block") {
        const blockWidth = 20;
        const blockHeight = 14;
        const blockX = supportSide === "left" ? targetX - blockWidth : targetX;
        return [
          `<line x1="${supportWallX.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(supportSide === "left" ? targetX + 2 : targetX - 2).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          `<rect x="${blockX.toFixed(1)}" y="${(y - blockHeight / 2).toFixed(1)}" width="${blockWidth}" height="${blockHeight}" fill="${supportColor}" rx="2"></rect>`,
          `<line x1="${blockX.toFixed(1)}" y1="${(y + blockHeight / 2 + 3).toFixed(1)}" x2="${(blockX + blockWidth).toFixed(1)}" y2="${(y + blockHeight / 2 + 3).toFixed(1)}" stroke="${supportColor}" stroke-width="2"></line>`,
          `<text x="${(targetX + (supportSide === "left" ? -9 : 9)).toFixed(1)}" y="${(y - 12).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="${supportSide === "left" ? "end" : "start"}">${escapeHtml(supportLabel)}</text>`,
        ].join("");
      }
      if (support.type === "rigid" || support.type === "clamp") {
        const bracketDirection = supportSide === "left" ? -1 : 1;
        return [
          `<line x1="${supportWallX.toFixed(1)}" y1="${(y - 12).toFixed(1)}" x2="${supportWallX.toFixed(1)}" y2="${(y + 12).toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          `<line x1="${supportWallX.toFixed(1)}" y1="${(y - 12).toFixed(1)}" x2="${(supportWallX + bracketDirection * 14).toFixed(1)}" y2="${(y - 12).toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          `<line x1="${supportWallX.toFixed(1)}" y1="${(y + 12).toFixed(1)}" x2="${(supportWallX + bracketDirection * 14).toFixed(1)}" y2="${(y + 12).toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          support.type === "clamp"
            ? `<line x1="${(supportWallX + bracketDirection * 7).toFixed(1)}" y1="${(y - 12).toFixed(1)}" x2="${(supportWallX + bracketDirection * 7).toFixed(1)}" y2="${(y + 12).toFixed(1)}" stroke="${supportColor}" stroke-width="2"></line>`
            : "",
          `<text x="${(supportWallX + bracketDirection * 18).toFixed(1)}" y="${(y - 16).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="${supportSide === "left" ? "end" : "start"}">${escapeHtml(supportLabel)}</text>`,
        ].join("");
      }
      if (support.type === "point_load") {
        const arrowStartX = supportSide === "left" ? supportWallX - 42 : supportWallX + 42;
        const arrowEndX = supportSide === "left" ? supportWallX - 6 : supportWallX + 6;
        const arrowHeadX = supportSide === "left" ? arrowEndX + 10 : arrowEndX - 10;
        return [
          `<line x1="${arrowStartX.toFixed(1)}" y1="${y.toFixed(1)}" x2="${arrowEndX.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${supportColor}" stroke-width="4"></line>`,
          `<polygon points="${arrowEndX.toFixed(1)},${y.toFixed(1)} ${arrowHeadX.toFixed(1)},${(y - 7).toFixed(1)} ${arrowHeadX.toFixed(1)},${(y + 7).toFixed(1)}" fill="${supportColor}"></polygon>`,
          `<text x="${arrowStartX.toFixed(1)}" y="${(y - 10).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="${supportSide === "left" ? "start" : "end"}">${escapeHtml(`${supportLabel} ${formatNumber(support.force_kN_per_m ?? 0, 1)} kN/m`)}</text>`,
        ].join("");
      }
      if (support.type === "moment") {
        const radius = 18;
        const sweep = supportSide === "left" ? 0 : 1;
        const startX = supportWallX - radius;
        const endX = supportWallX + radius;
        const arrowHeadX = supportSide === "left" ? endX - 6 : startX + 6;
        return [
          `<path d="M ${startX.toFixed(1)} ${(y + 2).toFixed(1)} A ${radius} ${radius} 0 1 ${sweep} ${endX.toFixed(1)} ${(y + 2).toFixed(1)}" stroke="${supportColor}" stroke-width="3" fill="none"></path>`,
          `<polygon points="${(supportSide === "left" ? arrowHeadX + 8 : arrowHeadX - 8).toFixed(1)},${(y - 10).toFixed(1)} ${arrowHeadX.toFixed(1)},${(y - 2).toFixed(1)} ${(supportSide === "left" ? arrowHeadX + 10 : arrowHeadX - 10).toFixed(1)},${(y + 6).toFixed(1)}" fill="${supportColor}"></polygon>`,
          `<text x="${supportWallX.toFixed(1)}" y="${(y - 22).toFixed(1)}" font-size="16" font-weight="700" fill="${supportColor}" text-anchor="middle">${escapeHtml(`${supportLabel} ${formatNumber(support.moment_kNm_per_m ?? 0, 1)} kNm/m`)}</text>`,
        ].join("");
      }
      return "";
    }).join("");

  const tickLevels: number[] = [];
  const tickStep = maxLevel - minLevel > 14 ? 2 : 1;
  for (let level = Math.floor(maxLevel / tickStep) * tickStep; level >= minLevel; level -= tickStep) {
    tickLevels.push(level);
  }
  const levelTicks = tickLevels.map((level) => {
    const y = scaleY(level);
    return `<line x1="88" y1="${y.toFixed(1)}" x2="101" y2="${y.toFixed(1)}" stroke="#657174" stroke-width="1.5"></line><text x="78" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="17" fill="#465154">${formatNumber(level, 0)} m</text>`;
  }).join("");
  const leftSurcharge = phase.surcharge_left_kPa ?? 0;
  const rightSurcharge = phase.surcharge_right_kPa ?? 0;
  const surchargeArrow = (x: number, y: number, value: number, anchor: "start" | "end") => value > 0
    ? `<line x1="${x}" y1="${(y - 35).toFixed(1)}" x2="${x}" y2="${(y - 8).toFixed(1)}" stroke="#9b2226" stroke-width="3"></line><polygon points="${x - 6},${(y - 12).toFixed(1)} ${x + 6},${(y - 12).toFixed(1)} ${x},${(y - 2).toFixed(1)}" fill="#9b2226"></polygon><text x="${x + (anchor === "start" ? 9 : -9)}" y="${(y - 21).toFixed(1)}" text-anchor="${anchor}" font-size="17" font-weight="700" fill="#7c2020">${formatNumber(value, 1)} kPa</text>`
    : "";
  const surfaceExtent = Math.max(wallX - leftSoilX, rightSoilX - wallX);
  const xAtDistance = (side: "left" | "right", distance: number, level: number) => {
    const offset = Math.min(15, Math.max(0, distance)) * surfaceExtent / 15;
    return wallAxisX(level) + (side === "left" ? -offset : offset);
  };
  const surfaceLevelAtDistance = (profile: CulmannPoint[], distance: number) => {
    const points = profile.filter((point): point is [number, number] => typeof point?.[0] === "number" && typeof point?.[1] === "number");
    if (!points.length) return 0;
    if (distance <= points[0][0]) return points[0][1];
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const next = points[index];
      if (distance <= next[0]) {
        const ratio = (distance - previous[0]) / Math.max(1e-9, next[0] - previous[0]);
        return previous[1] + ratio * (next[1] - previous[1]);
      }
    }
    return points[points.length - 1][1];
  };
  const surfacePolyline = (side: "left" | "right", profile: CulmannPoint[]) => {
    const points = profile.filter((point): point is [number, number] => typeof point?.[0] === "number" && typeof point?.[1] === "number");
    if (!points.length) return "";
    const mapped = points.map(([distance, level]) => `${xAtDistance(side, distance, level).toFixed(1)},${scaleY(level).toFixed(1)}`);
    const finalLevel = points[points.length - 1][1];
    const outsideX = side === "left" ? leftSoilX : rightSoilX;
    mapped.push(`${outsideX.toFixed(1)},${scaleY(finalLevel).toFixed(1)}`);
    return `<polyline class="culmann-surface-profile" data-surface-profile="${side}" points="${mapped.join(" ")}" fill="none" stroke="#7d5a36" stroke-width="3"></polyline>`;
  };
  const stripLoadBlocks = (side: "left" | "right", profile: CulmannPoint[]) => {
    const strips = phase[`strip_surcharges_${side}`] ?? [];
    return strips.map((strip, stripIndex) => {
      const points = strip.points.filter((point): point is [number, number] => typeof point?.[0] === "number" && typeof point?.[1] === "number");
      if (!points.length) return "";
      const pairs: Array<[number, number, number]> = points.length === 1
        ? [[points[0][0], points[0][0], points[0][1]]]
        : points.slice(1).map((point, index) => [points[index][0], point[0], (points[index][1] + point[1]) / 2]);
      const blocks = pairs.map(([start, end, load], pairIndex) => {
        const startX = xAtDistance(side, start, surfaceLevelAtDistance(profile, start));
        const endX = xAtDistance(side, end, surfaceLevelAtDistance(profile, end));
        const midDistance = (start + end) / 2;
        const groundY = scaleY(surfaceLevelAtDistance(profile, midDistance));
        const blockHeight = Math.max(7, Math.min(28, Math.abs(load) * 0.25));
        const blockWidth = Math.max(6, Math.abs(endX - startX));
        const blockX = (startX + endX) / 2 - blockWidth / 2;
        return `<rect class="strip-load-block" data-strip-load-block="${side}-${stripIndex + 1}-${pairIndex + 1}" x="${blockX.toFixed(1)}" y="${(groundY - blockHeight).toFixed(1)}" width="${blockWidth.toFixed(1)}" height="${blockHeight.toFixed(1)}" rx="2" fill="#bd4a38" fill-opacity="0.84" stroke="#8c2f25"></rect>`;
      }).join("");
      const midDistance = (points[0][0] + points[points.length - 1][0]) / 2;
      const midX = xAtDistance(side, midDistance, surfaceLevelAtDistance(profile, midDistance));
      const labelY = scaleY(surfaceLevelAtDistance(profile, midDistance)) - 32;
      const maxLoad = Math.max(...points.map((point) => point[1]));
      return `${blocks}<text class="strip-load-label" x="${midX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="#7c2020">${formatNumber(maxLoad, 1)} kPa</text>`;
    }).join("");
  };
  const culmannSurfaces = showCulmannGeometry
    ? `${surfacePolyline("left", leftSurfaceProfile)}${surfacePolyline("right", rightSurfaceProfile)}`
    : "";
  const culmannStrips = showCulmannGeometry
    ? `${stripLoadBlocks("left", leftSurfaceProfile)}${stripLoadBlocks("right", rightSurfaceProfile)}`
    : "";
  const legend = [
    `Phase ${phaseIndex + 1}: ${phase.name}`,
    `Left excavation ${formatNumber(phase.excavation_level_left_m, 1)} m`,
    `Right excavation ${formatNumber(phase.excavation_level_right_m, 1)} m`,
    `Surface L/R ${formatNumber(leftSurfaceLevel, 1)} / ${formatNumber(rightSurfaceLevel, 1)} m`,
    `Wall inclination ${formatNumber(project.wall_geometry.inclination_degrees ?? 0, 1)}°`,
    `Vertical wall load ${formatNumber(phase.vertical_line_load_kN_per_m ?? 0, 1)} kN/m${phase.include_vertical_line_second_order ? " · 2nd order on" : ""}`,
    activeSupports.length
      ? `Supports ${activeSupports.map((support) => `${support.id} ${supportTypeLabel(support.type)}`).join(", ")}`
      : "Supports none in this phase",
  ];

  return `
    <div class="geometry-figure">
      <svg class="geometry-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Retaining wall geometry preview">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#fdfbf6"></rect>
        ${leftSoils}
        ${rightSoils}
        <rect x="${leftSoilX}" y="0" width="${soilWidth}" height="${leftExcavationY.toFixed(1)}" fill="#fdfbf6"></rect>
        <rect x="${(rightSoilX - soilWidth).toFixed(1)}" y="0" width="${soilWidth}" height="${rightExcavationY.toFixed(1)}" fill="#fdfbf6"></rect>
        ${levelTicks}
        ${showCulmannGeometry ? culmannSurfaces : `<line x1="${leftSoilX}" y1="${leftSurfaceY.toFixed(1)}" x2="${wallAxisX(leftSurfaceLevel).toFixed(1)}" y2="${leftSurfaceY.toFixed(1)}" stroke="#7d5a36" stroke-width="2" stroke-dasharray="5 5"></line><line x1="${wallAxisX(rightSurfaceLevel).toFixed(1)}" y1="${rightSurfaceY.toFixed(1)}" x2="${rightSoilX}" y2="${rightSurfaceY.toFixed(1)}" stroke="#7d5a36" stroke-width="2" stroke-dasharray="5 5"></line>`}
        ${culmannStrips}
        <line x1="${leftSoilX}" y1="${leftWaterY.toFixed(1)}" x2="${(wallAxisX(phase.groundwater_level_left_m) - 10).toFixed(1)}" y2="${leftWaterY.toFixed(1)}" stroke="#2f8fda" stroke-width="2.5" stroke-dasharray="8 7"></line>
        <line x1="${(wallAxisX(phase.groundwater_level_right_m) + 10).toFixed(1)}" y1="${rightWaterY.toFixed(1)}" x2="${rightSoilX}" y2="${rightWaterY.toFixed(1)}" stroke="#2f8fda" stroke-width="2.5" stroke-dasharray="8 7"></line>
        <text x="${wallAxisX(phase.groundwater_level_left_m) - 16}" y="${(leftWaterY - 6).toFixed(1)}" font-size="22" fill="#146aa8">▽</text>
        <text x="${wallAxisX(phase.groundwater_level_right_m) + 14}" y="${(rightWaterY - 6).toFixed(1)}" font-size="22" fill="#146aa8">▽</text>
        <line x1="${leftSoilX}" y1="${leftExcavationY.toFixed(1)}" x2="${wallAxisX(phase.excavation_level_left_m).toFixed(1)}" y2="${leftExcavationY.toFixed(1)}" stroke="#9b6b43" stroke-width="3"></line>
        <line x1="${wallAxisX(phase.excavation_level_right_m).toFixed(1)}" y1="${rightExcavationY.toFixed(1)}" x2="${rightSoilX}" y2="${rightExcavationY.toFixed(1)}" stroke="#9b6b43" stroke-width="3"></line>
        ${surchargeArrow(leftSoilX + soilWidth / 2, leftSurfaceY, leftSurcharge, "start")}
        ${surchargeArrow(rightSoilX - soilWidth / 2, rightSurfaceY, rightSurcharge, "end")}
        ${wallSegments}
        ${supports}
      </svg>
      <ul class="geometry-legend" aria-label="Phase and geometry notes">
        ${legend.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function buildTabbedQuickEditorHtml(flatMarkup: string) {
  const tabDefinitions = [
    { id: "general", label: "General" },
    { id: "wall", label: "Wall" },
    { id: "soils", label: "Soils" },
    { id: "phases", label: "Phases" },
    { id: "supports", label: "Supports" },
    { id: "json", label: "JSON" },
  ];
  const grouped = new Map(tabDefinitions.map((tab) => [tab.id, [] as string[]]));
  const culmannBlock = flatMarkup.match(/<section class="culmann-phase-block"[\s\S]*?<\/section>/)?.[0];
  const markupWithoutCulmannBlock = culmannBlock ? flatMarkup.replace(culmannBlock, "") : flatMarkup;
  const ec7Block = markupWithoutCulmannBlock.match(/<section class="ec7-factor-block"[\s\S]*?<\/section>/)?.[0];
  const markupWithoutSpecialBlocks = ec7Block
    ? markupWithoutCulmannBlock.replace(ec7Block, "")
    : markupWithoutCulmannBlock;
  const items = markupWithoutSpecialBlocks.match(/<label class="quick-editor-field">[\s\S]*?<\/label>|<div class="quick-editor-actions">[\s\S]*?<\/div>|<p class="quick-editor-note"[^>]*>[\s\S]*?<\/p>/g) ?? [];
  for (const item of items) {
    let group = "general";
    if (/data-qe-support-(?:index|id|type|side|depth|active|inclination|stiffness|prestress|capacity|force|moment|action-type)|anchor-inclination|support_(?:add|remove)/.test(item)) {
      group = "supports";
    } else if (/data-qe-(?:left-|right-)|left_layer_|right_layer_/.test(item)) {
      group = "soils";
    } else if (/data-qe-phase-name|phase_(?:duplicate|remove)|data-qe-(?:surface|exc-|gw-|sur-|vertical-load|vertical-line-load-action|second-order|surcharge-.*-action|culmann-ignored)/.test(item)) {
      group = "phases";
    } else if (/data-qe-(?:segment|library|section-name|wpl|av|fy|gamma-m0)|segment_(?:split|remove)/.test(item)) {
      group = "wall";
    }
    grouped.get(group)?.push(item);
  }
  if (culmannBlock) grouped.get("phases")?.push(culmannBlock);
  if (ec7Block) grouped.get("general")?.push(ec7Block);

  const tabButtons = tabDefinitions.map((tab, index) => `
    <button type="button" class="editor-tab" id="editor-tab-${tab.id}" role="tab" aria-controls="editor-panel-${tab.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}" data-editor-tab="${tab.id}">${tab.label}</button>
  `).join("");
  const tabPanels = tabDefinitions.map((tab, index) => `
    <section class="editor-tab-panel" id="editor-panel-${tab.id}" role="tabpanel" aria-labelledby="editor-tab-${tab.id}" ${index === 0 ? "" : "hidden"}>
      ${tab.id === "json"
        ? `<div class="json-editor-note">Canonical project payload. Direct edits are parsed and reflected in the preview.</div><div data-json-input-mount></div>`
        : `<div class="quick-editor-grid">${grouped.get(tab.id)?.join("\n") ?? ""}</div>`}
    </section>
  `).join("");

  return `<div class="editor-tabs" role="tablist" aria-label="Project input sections">${tabButtons}</div><div class="editor-tab-panels">${tabPanels}</div>`;
}

function culmannSideEditorHtml(project: ProjectInput, phase: PhaseInput, side: "left" | "right") {
  const profile = phase[`surface_profile_${side}_m`]?.length
    ? phase[`surface_profile_${side}_m`]!
    : [[0, soilTopLevel(project, phase, side)] as CulmannPoint];
  const strips = phase[`strip_surcharges_${side}`] ?? [];
  const profileRows = profile.map((point, rowIndex) => {
    const firstPoint = rowIndex === 0;
    const distance = firstPoint ? 0 : point?.[0];
    const level = firstPoint ? soilTopLevel(project, phase, side) : point?.[1];
    return `<tr><th scope="row">${rowIndex + 1}</th><td><input type="number" step="any" aria-label="${side} surface distance ${rowIndex + 1}" data-cm-profile-distance data-side="${side}" data-row="${rowIndex}" value="${escapeHtml(distance ?? "")}" ${firstPoint ? "readonly" : ""}></td><td><input type="number" step="any" aria-label="${side} surface level ${rowIndex + 1}" data-cm-profile-level data-side="${side}" data-row="${rowIndex}" value="${escapeHtml(level ?? "")}" ${firstPoint ? "readonly" : ""}></td><td><button type="button" class="secondary-button" data-qe-culmann-action="profile_remove" data-side="${side}" data-row="${rowIndex}" ${firstPoint ? "disabled" : ""} aria-label="Remove ${side} surface point ${rowIndex + 1}">Remove</button></td></tr>`;
  }).join("");
  const stripCards = strips.map((strip, stripIndex) => {
    const pointRows = strip.points.map((point, rowIndex) => `<tr><th scope="row">${rowIndex + 1}</th><td><input type="number" step="any" min="0" aria-label="${side} strip ${stripIndex + 1} distance ${rowIndex + 1}" data-cm-strip-distance data-side="${side}" data-strip="${stripIndex}" data-row="${rowIndex}" value="${escapeHtml(point?.[0] ?? "")}"></td><td><input type="number" step="any" min="0" max="1000" aria-label="${side} strip ${stripIndex + 1} load ${rowIndex + 1}" data-cm-strip-load data-side="${side}" data-strip="${stripIndex}" data-row="${rowIndex}" value="${escapeHtml(point?.[1] ?? "")}"></td><td><button type="button" class="secondary-button" data-qe-culmann-action="strip_point_remove" data-side="${side}" data-strip="${stripIndex}" data-row="${rowIndex}" aria-label="Remove ${side} strip ${stripIndex + 1} point ${rowIndex + 1}">Remove</button></td></tr>`).join("");
    return `<article class="culmann-strip-card"><div class="culmann-strip-heading"><h5>${side === "left" ? "Left" : "Right"} strip ${stripIndex + 1}</h5><button type="button" class="secondary-button" data-qe-culmann-action="strip_remove" data-side="${side}" data-strip="${stripIndex}">Remove strip</button></div>${pointRows ? `<div class="table-shell culmann-table-shell"><table class="culmann-table"><thead><tr><th>Point</th><th>Distance (m)</th><th>Load (kPa)</th><th></th></tr></thead><tbody>${pointRows}</tbody></table></div>` : `<p class="quick-editor-note culmann-empty-strip">This strip has no points yet. Add a point before analysis.</p>`}<div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-culmann-action="strip_point_add" data-side="${side}" data-strip="${stripIndex}" ${strip.points.length >= 50 ? "disabled" : ""}>Add strip point</button>${project.design_mode === "ec7" ? ec7ActionTypeSelect(`data-cm-strip-action data-side="${side}" data-strip="${stripIndex}"`, strip.action) : ""}</div></article>`;
  }).join("");
  return `<div class="culmann-side-editor"><h4>${side === "left" ? "Left" : "Right"}</h4><h5>Surface profile</h5><p class="quick-editor-note">The first row stays at distance 0 m and follows this phase's soil top.</p><div class="table-shell culmann-table-shell"><table class="culmann-table"><thead><tr><th>Point</th><th>Distance (m)</th><th>Level (m)</th><th></th></tr></thead><tbody>${profileRows}</tbody></table></div><div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-culmann-action="profile_add" data-side="${side}" ${profile.length >= 50 ? "disabled" : ""}>Add surface point</button></div><h5>Strip surcharges</h5>${stripCards}<div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-culmann-action="strip_add" data-side="${side}" ${strips.length >= 10 ? "disabled" : ""}>Add strip surcharge</button></div></div>`;
}

function culmannPhaseEditorHtml(project: ProjectInput, phase: PhaseInput) {
  return `<section class="culmann-phase-block"><h3>Culmann ground and strip loads</h3><div class="culmann-sides-grid">${culmannSideEditorHtml(project, phase, "left")}${culmannSideEditorHtml(project, phase, "right")}</div></section>`;
}

export function buildQuickEditorHtml(project: ProjectInput, phaseIndex = 0, focus: EditorFocusState = {}) {
  const phase = activePhaseForProject(project, phaseIndex);
  const focusState = normalizeEditorFocus(project, focus);
  const wallLengthSearch = wallLengthSearchForProject(project);
  const gammaM0Default = defaultSteelGammaM0(project.design_mode);
  const toeControlMode = wallLengthSearch ? "search" : "fixed";
  const selectedSupport = project.supports[focusState.supportIndex];
  const leftLayer = project.soil_profiles.left.layers[focusState.leftLayerIndex];
  const rightLayer = project.soil_profiles.right.layers[focusState.rightLayerIndex];
  const selectedSegment = project.wall_geometry.segments[focusState.segmentIndex];
  const culmannInputs = (project.earth_pressure_method ?? "coulomb") === "culmann"
    ? culmannPhaseEditorHtml(project, phase)
    : `<p class="quick-editor-note" data-qe-culmann-ignored>Surface profiles and strip surcharges are kept in this project but ignored while Coulomb is selected.</p>`;
  const section = selectedSegment?.steel_section || {};
  const libraryOptions = Object.entries(STEEL_SHEET_PILE_LIBRARY).map(([id, item]) => `
    <option value="${escapeHtml(id)}" ${section.library_section_id === id ? "selected" : ""}>${escapeHtml(item.label)}</option>
  `).join("");
  const wallTypeSpecificSectionControls = project.wall_type === "steel_sheet_pile"
    ? `
      <label class="quick-editor-field"><span>Steel section</span><select data-qe-library><option value="" ${section.library_section_id ? "" : "selected"}>Manual / custom</option>${libraryOptions}</select></label>
      <label class="quick-editor-field"><span>Manual section name</span><input data-qe-section-name type="text" value="${escapeHtml(section.section_name ?? "")}"></label>
      <label class="quick-editor-field"><span>Manual Wpl</span><input data-qe-wpl type="number" step="1" value="${escapeHtml(section.plastic_section_modulus_cm3_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Manual Av</span><input data-qe-av type="number" step="0.1" value="${escapeHtml(section.shear_area_cm2_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Steel grade fy</span><input data-qe-fy type="number" step="1" value="${escapeHtml(section.steel_grade_mpa ?? 355)}"></label>
      <label class="quick-editor-field"><span>Gamma M0</span><input data-qe-gamma-m0 type="number" step="0.01" min="0.1" value="${escapeHtml(section.gamma_m0 ?? gammaM0Default)}"></label>
    `
    : `
      <p class="quick-editor-note">Constant bending stiffness EI (optionally the cracked EI above the cracking moment); a moment-curvature relation is not modelled yet.</p>
    `;
  const segmentOptions = project.wall_geometry.segments.length
    ? project.wall_geometry.segments.map((segment, index) => `
      <option value="${index}" ${index === focusState.segmentIndex ? "selected" : ""}>${escapeHtml(`${index + 1}. ${segment.label || `Segment ${index + 1}`}`)}</option>
    `).join("")
    : `<option value="0" selected>No segments</option>`;
  const leftLayerOptions = project.soil_profiles.left.layers.length
    ? project.soil_profiles.left.layers.map((layer, index) => `
      <option value="${index}" ${index === focusState.leftLayerIndex ? "selected" : ""}>${escapeHtml(`${index + 1}. ${formatNumber(layer.top_level_m, 1)} to ${formatNumber(layer.bottom_level_m, 1)} m`)}</option>
    `).join("")
    : `<option value="0" selected>No left layers</option>`;
  const rightLayerOptions = project.soil_profiles.right.layers.length
    ? project.soil_profiles.right.layers.map((layer, index) => `
      <option value="${index}" ${index === focusState.rightLayerIndex ? "selected" : ""}>${escapeHtml(`${index + 1}. ${formatNumber(layer.top_level_m, 1)} to ${formatNumber(layer.bottom_level_m, 1)} m`)}</option>
    `).join("")
    : `<option value="0" selected>No right layers</option>`;
  const supportOptions = project.supports.length
    ? project.supports.map((support, index) => `
      <option value="${index}" ${index === focusState.supportIndex ? "selected" : ""}>${escapeHtml(`${index + 1}. ${support.id} ${supportTypeLabel(support.type)}`)}</option>
    `).join("")
    : `<option value="0" selected>No supports</option>`;
  const flatMarkup = `
    <div class="quick-editor-grid">
      <label class="quick-editor-field"><span>Wall segment</span><select data-qe-segment-index>${segmentOptions}</select></label>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-structure-action="segment_split">Split segment</button><button type="button" class="secondary-button" data-qe-structure-action="segment_remove">Remove segment</button></div>
      <label class="quick-editor-field"><span>Left soil layer</span><select data-qe-left-layer-index>${leftLayerOptions}</select></label>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-structure-action="left_layer_split">Split left layer</button><button type="button" class="secondary-button" data-qe-structure-action="left_layer_remove">Remove left layer</button></div>
      <label class="quick-editor-field"><span>Right soil layer</span><select data-qe-right-layer-index>${rightLayerOptions}</select></label>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-structure-action="right_layer_split">Split right layer</button><button type="button" class="secondary-button" data-qe-structure-action="right_layer_remove">Remove right layer</button></div>
      <label class="quick-editor-field"><span>Support item</span><select data-qe-support-index>${supportOptions}</select></label>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-structure-action="support_add">Add support</button><button type="button" class="secondary-button" data-qe-structure-action="support_remove">Remove support</button></div>
      <label class="quick-editor-field"><span>Phase name</span><input data-qe-phase-name type="text" value="${escapeHtml(phase.name)}"></label>
      <div class="quick-editor-actions"><button type="button" class="secondary-button" data-qe-structure-action="phase_duplicate">Duplicate phase</button><button type="button" class="secondary-button" data-qe-structure-action="phase_remove">Remove phase</button></div>
      <label class="quick-editor-field"><span>Wall type</span><select data-qe-wall-type><option value="steel_sheet_pile" ${project.wall_type === "steel_sheet_pile" ? "selected" : ""}>Steel sheet pile</option><option value="diaphragm_wall" ${project.wall_type === "diaphragm_wall" ? "selected" : ""}>Diaphragm wall</option></select></label>
      <label class="quick-editor-field"><span>Design mode</span><select data-qe-design-mode><option value="classic" ${project.design_mode === "classic" ? "selected" : ""}>Classic</option><option value="ec7" ${project.design_mode === "ec7" ? "selected" : ""}>EC7-BE (design approach 1)</option></select></label>
      <label class="quick-editor-field"><span>Earth pressure</span><select data-qe-earth-pressure-method><option value="coulomb" ${(project.earth_pressure_method ?? "coulomb") === "coulomb" ? "selected" : ""}>Coulomb, horizontal surface (default)</option><option value="culmann" ${project.earth_pressure_method === "culmann" ? "selected" : ""}>Culmann, sloping surface and strip loads</option></select></label>
      <label class="quick-editor-field"><span>Wall friction limit</span><select data-qe-wall-friction-cap><option value="phi_over_3" ${(project.wall_friction_cap ?? "phi_over_3") === "phi_over_3" ? "selected" : ""}>δ ≤ φ/3 (default)</option><option value="cur166" ${project.wall_friction_cap === "cur166" ? "selected" : ""}>CUR 166 (passive side)</option><option value="none" ${project.wall_friction_cap === "none" ? "selected" : ""}>Input δ</option></select></label>
      <p class="quick-editor-note">Default: conservative horizontal-surface method; Culmann follows CUR 166 4.5 with straight slip planes.</p>
      <label class="quick-editor-field"><span>Toe control</span><select data-qe-toe-mode><option value="fixed" ${toeControlMode === "fixed" ? "selected" : ""}>Fixed toe</option><option value="search" ${toeControlMode === "search" ? "selected" : ""}>Search length</option></select></label>
      <label class="quick-editor-field"><span>Top level</span><input data-qe-top-level type="number" step="0.1" value="${escapeHtml(project.wall_geometry.top_level_m)}"></label>
      <label class="quick-editor-field"><span>Toe level</span><input data-qe-toe-level type="number" step="0.1" value="${escapeHtml(project.wall_geometry.toe_level_m)}"></label>
      <label class="quick-editor-field"><span>Search start toe</span><input data-qe-search-start type="number" step="0.1" value="${escapeHtml(wallLengthSearch?.start_toe_level_m ?? project.wall_geometry.toe_level_m)}"></label>
      <label class="quick-editor-field"><span>Search minimum toe</span><input data-qe-search-minimum type="number" step="0.1" value="${escapeHtml(wallLengthSearch?.minimum_toe_level_m ?? project.wall_geometry.toe_level_m - 1)}"></label>
      <label class="quick-editor-field"><span>Search step</span><input data-qe-search-step type="number" step="0.1" min="0.1" value="${escapeHtml(wallLengthSearch?.step_m ?? 0.5)}"></label>
      <label class="quick-editor-field"><span>Max head displacement</span><input data-qe-search-max-disp type="number" step="0.1" value="${escapeHtml(wallLengthSearch?.max_head_displacement_mm ?? 60)}"></label>
      <label class="quick-editor-field"><span>Target element length</span><input data-qe-target-element-length type="number" step="0.05" min="0.05" value="${escapeHtml(targetElementLengthForProject(project))}"></label>
      <label class="quick-editor-field"><span>Max wall displacement (project limit)</span><input data-qe-max-wall-displacement type="number" step="0.1" min="0.1" value="${escapeHtml(project.design_options?.max_wall_displacement_mm ?? "")}" placeholder="Required for public analysis"></label>
      <label class="quick-editor-field"><span>Segment label</span><input data-qe-segment-label type="text" value="${escapeHtml(selectedSegment?.label ?? "")}"></label>
      <label class="quick-editor-field"><span>Segment top</span><input data-qe-segment-top type="number" step="0.1" value="${escapeHtml(selectedSegment?.top_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Segment bottom</span><input data-qe-segment-bottom type="number" step="0.1" value="${escapeHtml(selectedSegment?.bottom_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Wall inclination</span><input data-qe-inclination type="number" step="0.1" value="${escapeHtml(project.wall_geometry.inclination_degrees ?? 0)}"></label>
      <label class="quick-editor-field"><span>Segment EI</span><input data-qe-segment-ei type="number" step="1" value="${escapeHtml(selectedSegment?.ei_kNm2_per_m ?? "")}" ${project.wall_type === "diaphragm_wall" ? "required" : ""}></label>
      <label class="quick-editor-field"><span>Cracked EI</span><input data-qe-segment-cracked-ei type="number" step="1" value="${escapeHtml(selectedSegment?.cracked_ei_kNm2_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Cracking moment</span><input data-qe-segment-cracking-moment type="number" step="1" value="${escapeHtml(selectedSegment?.cracking_moment_kNm_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Design moment resistance</span><input data-qe-segment-mr type="number" step="1" value="${escapeHtml(selectedSegment?.moment_resistance_kNm_per_m ?? "")}" ${project.wall_type === "diaphragm_wall" ? "required" : ""}></label>
      <label class="quick-editor-field"><span>Design shear resistance</span><input data-qe-segment-vr type="number" step="1" value="${escapeHtml(selectedSegment?.shear_resistance_kN_per_m ?? "")}" ${project.wall_type === "diaphragm_wall" ? "required" : ""}></label>
      ${wallTypeSpecificSectionControls}
      <label class="quick-editor-field"><span>Surface left</span><input data-qe-surface-left type="number" step="0.1" value="${escapeHtml(phase.surface_level_left_m ?? project.wall_geometry.top_level_m)}"></label>
      <label class="quick-editor-field"><span>Surface right</span><input data-qe-surface-right type="number" step="0.1" value="${escapeHtml(phase.surface_level_right_m ?? project.wall_geometry.top_level_m)}"></label>
      <label class="quick-editor-field"><span>Excavation left</span><input data-qe-exc-left type="number" step="0.1" value="${escapeHtml(phase.excavation_level_left_m)}"></label>
      <label class="quick-editor-field"><span>Excavation right</span><input data-qe-exc-right type="number" step="0.1" value="${escapeHtml(phase.excavation_level_right_m)}"></label>
      <label class="quick-editor-field"><span>Groundwater left</span><input data-qe-gw-left type="number" step="0.1" value="${escapeHtml(phase.groundwater_level_left_m)}"></label>
      <label class="quick-editor-field"><span>Groundwater right</span><input data-qe-gw-right type="number" step="0.1" value="${escapeHtml(phase.groundwater_level_right_m)}"></label>
      <label class="quick-editor-field"><span>Surcharge left</span><input data-qe-sur-left type="number" step="0.1" value="${escapeHtml(phase.surcharge_left_kPa ?? 0)}"></label>
      ${project.design_mode === "ec7" ? `<label class="quick-editor-field"><span>Left surcharge action</span>${ec7ActionTypeSelect("data-qe-surcharge-left-action", phase.surcharge_left_action)}</label>` : ""}
      <label class="quick-editor-field"><span>Surcharge right</span><input data-qe-sur-right type="number" step="0.1" value="${escapeHtml(phase.surcharge_right_kPa ?? 0)}"></label>
      ${project.design_mode === "ec7" ? `<label class="quick-editor-field"><span>Right surcharge action</span>${ec7ActionTypeSelect("data-qe-surcharge-right-action", phase.surcharge_right_action)}</label>` : ""}
      <label class="quick-editor-field"><span>Phase vertical load</span><input data-qe-vertical-load type="number" step="1" value="${escapeHtml(project.phases[phaseIndex]?.vertical_line_load_kN_per_m ?? 0)}"></label>
      ${project.design_mode === "ec7" ? `<label class="quick-editor-field"><span>Vertical line load action</span>${ec7ActionTypeSelect("data-qe-vertical-line-load-action", phase.vertical_line_load_action ?? "permanent_unfavourable")}</label>` : ""}
      <label class="quick-editor-field"><span>2nd order</span><select data-qe-second-order><option value="false" ${project.phases[phaseIndex]?.include_vertical_line_second_order ? "" : "selected"}>Off</option><option value="true" ${project.phases[phaseIndex]?.include_vertical_line_second_order ? "selected" : ""}>On</option></select></label>
      ${culmannInputs}
      <label class="quick-editor-field"><span>Left layer top</span><input data-qe-left-top type="number" step="0.1" value="${escapeHtml(leftLayer?.top_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Left layer bottom</span><input data-qe-left-bottom type="number" step="0.1" value="${escapeHtml(leftLayer?.bottom_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Left γ dry</span><input data-qe-left-gamma-dry type="number" step="0.1" value="${escapeHtml(leftLayer?.unit_weight_dry_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Left γ wet</span><input data-qe-left-gamma-wet type="number" step="0.1" value="${escapeHtml(leftLayer?.unit_weight_wet_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Left φ</span><input data-qe-left-phi type="number" step="0.1" value="${escapeHtml(leftLayer?.friction_angle_deg ?? "")}"></label>
      <label class="quick-editor-field"><span>Left cohesion</span><input data-qe-left-cohesion type="number" step="0.1" value="${escapeHtml(leftLayer?.cohesion_kPa ?? "")}"></label>
      <label class="quick-editor-field"><span>Left wall friction</span><input data-qe-left-wall-friction type="number" step="0.1" value="${escapeHtml(leftLayer?.wall_friction_deg ?? "")}"></label>
      <label class="quick-editor-field"><span>Left K0 / Ka / Kp</span><input data-qe-left-k0 type="number" step="0.01" value="${escapeHtml(leftLayer?.at_rest_coefficient ?? "")}" placeholder="K0"><input data-qe-left-ka type="number" step="0.01" value="${escapeHtml(leftLayer?.active_coefficient ?? "")}" placeholder="Ka"><input data-qe-left-kp type="number" step="0.01" value="${escapeHtml(leftLayer?.passive_coefficient ?? "")}" placeholder="Kp"></label>
      <label class="quick-editor-field"><span>Left bedding model</span><select data-qe-left-bedding-model><option value="linear" ${(leftLayer?.bedding_model ?? "linear") === "linear" ? "selected" : ""}>Linear</option><option value="tri_linear" ${leftLayer?.bedding_model === "tri_linear" ? "selected" : ""}>Tri-linear</option></select></label>
      <label class="quick-editor-field"><span>Left tri-linear breakpoints</span><input data-qe-left-breakpoint-1 type="number" step="0.1" value="${escapeHtml(leftLayer?.tri_linear_displacement_breakpoints_mm?.[0] ?? "")}" placeholder="bp1 mm"><input data-qe-left-breakpoint-2 type="number" step="0.1" value="${escapeHtml(leftLayer?.tri_linear_displacement_breakpoints_mm?.[1] ?? "")}" placeholder="bp2 mm"></label>
      <label class="quick-editor-field"><span>Left tri-linear factors</span><input data-qe-left-factor-1 type="number" step="0.01" value="${escapeHtml(leftLayer?.tri_linear_stiffness_factors?.[0] ?? "")}" placeholder="k1"><input data-qe-left-factor-2 type="number" step="0.01" value="${escapeHtml(leftLayer?.tri_linear_stiffness_factors?.[1] ?? "")}" placeholder="k2"><input data-qe-left-factor-3 type="number" step="0.01" value="${escapeHtml(leftLayer?.tri_linear_stiffness_factors?.[2] ?? "")}" placeholder="k3"></label>
      <label class="quick-editor-field"><span>Left ks</span><input data-qe-left-ks type="number" step="1" value="${escapeHtml(leftLayer?.subgrade_modulus_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Left pore offset</span><input data-qe-left-pore type="number" step="0.1" value="${escapeHtml(leftLayer?.pore_pressure_offset_kPa ?? "")}"></label>
      <label class="quick-editor-field"><span>Right layer top</span><input data-qe-right-top type="number" step="0.1" value="${escapeHtml(rightLayer?.top_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Right layer bottom</span><input data-qe-right-bottom type="number" step="0.1" value="${escapeHtml(rightLayer?.bottom_level_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Right γ dry</span><input data-qe-right-gamma-dry type="number" step="0.1" value="${escapeHtml(rightLayer?.unit_weight_dry_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Right γ wet</span><input data-qe-right-gamma-wet type="number" step="0.1" value="${escapeHtml(rightLayer?.unit_weight_wet_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Right φ</span><input data-qe-right-phi type="number" step="0.1" value="${escapeHtml(rightLayer?.friction_angle_deg ?? "")}"></label>
      <label class="quick-editor-field"><span>Right cohesion</span><input data-qe-right-cohesion type="number" step="0.1" value="${escapeHtml(rightLayer?.cohesion_kPa ?? "")}"></label>
      <label class="quick-editor-field"><span>Right wall friction</span><input data-qe-right-wall-friction type="number" step="0.1" value="${escapeHtml(rightLayer?.wall_friction_deg ?? "")}"></label>
      <label class="quick-editor-field"><span>Right K0 / Ka / Kp</span><input data-qe-right-k0 type="number" step="0.01" value="${escapeHtml(rightLayer?.at_rest_coefficient ?? "")}" placeholder="K0"><input data-qe-right-ka type="number" step="0.01" value="${escapeHtml(rightLayer?.active_coefficient ?? "")}" placeholder="Ka"><input data-qe-right-kp type="number" step="0.01" value="${escapeHtml(rightLayer?.passive_coefficient ?? "")}" placeholder="Kp"></label>
      <label class="quick-editor-field"><span>Right bedding model</span><select data-qe-right-bedding-model><option value="linear" ${(rightLayer?.bedding_model ?? "linear") === "linear" ? "selected" : ""}>Linear</option><option value="tri_linear" ${rightLayer?.bedding_model === "tri_linear" ? "selected" : ""}>Tri-linear</option></select></label>
      <label class="quick-editor-field"><span>Right tri-linear breakpoints</span><input data-qe-right-breakpoint-1 type="number" step="0.1" value="${escapeHtml(rightLayer?.tri_linear_displacement_breakpoints_mm?.[0] ?? "")}" placeholder="bp1 mm"><input data-qe-right-breakpoint-2 type="number" step="0.1" value="${escapeHtml(rightLayer?.tri_linear_displacement_breakpoints_mm?.[1] ?? "")}" placeholder="bp2 mm"></label>
      <label class="quick-editor-field"><span>Right tri-linear factors</span><input data-qe-right-factor-1 type="number" step="0.01" value="${escapeHtml(rightLayer?.tri_linear_stiffness_factors?.[0] ?? "")}" placeholder="k1"><input data-qe-right-factor-2 type="number" step="0.01" value="${escapeHtml(rightLayer?.tri_linear_stiffness_factors?.[1] ?? "")}" placeholder="k2"><input data-qe-right-factor-3 type="number" step="0.01" value="${escapeHtml(rightLayer?.tri_linear_stiffness_factors?.[2] ?? "")}" placeholder="k3"></label>
      <label class="quick-editor-field"><span>Right ks</span><input data-qe-right-ks type="number" step="1" value="${escapeHtml(rightLayer?.subgrade_modulus_kN_m3 ?? "")}"></label>
      <label class="quick-editor-field"><span>Right pore offset</span><input data-qe-right-pore type="number" step="0.1" value="${escapeHtml(rightLayer?.pore_pressure_offset_kPa ?? "")}"></label>
      <label class="quick-editor-field"><span>Support id</span><input data-qe-support-id type="text" value="${escapeHtml(selectedSupport?.id ?? "")}"></label>
      <label class="quick-editor-field"><span>Support type</span><select data-qe-support-type><option value="anchor" ${selectedSupport?.type === "anchor" ? "selected" : ""}>Anchor</option><option value="strut" ${selectedSupport?.type === "strut" ? "selected" : ""}>Strut</option><option value="spring" ${selectedSupport?.type === "spring" ? "selected" : ""}>Spring</option><option value="underwater_concrete_block" ${selectedSupport?.type === "underwater_concrete_block" ? "selected" : ""}>Underwater concrete block</option><option value="rigid" ${selectedSupport?.type === "rigid" ? "selected" : ""}>Rigid</option><option value="clamp" ${selectedSupport?.type === "clamp" ? "selected" : ""}>Clamp</option><option value="point_load" ${selectedSupport?.type === "point_load" ? "selected" : ""}>Point load</option><option value="moment" ${selectedSupport?.type === "moment" ? "selected" : ""}>Moment</option></select></label>
      <label class="quick-editor-field"><span>Support side</span><select data-qe-support-side><option value="right" ${selectedSupport?.side !== "left" ? "selected" : ""}>Right</option><option value="left" ${selectedSupport?.side === "left" ? "selected" : ""}>Left</option></select></label>
      <label class="quick-editor-field"><span>Support depth</span><input data-qe-support-depth type="number" step="0.1" value="${escapeHtml(selectedSupport?.depth_m ?? 0)}"></label>
      <label class="quick-editor-field"><span>Support active from phase</span><input data-qe-support-active-from type="number" step="1" min="1" value="${escapeHtml((selectedSupport?.active_from_phase ?? 0) + 1)}"></label>
      <label class="quick-editor-field"><span>Support active to phase</span><input data-qe-support-active-to type="number" step="1" min="1" value="${escapeHtml(selectedSupport?.active_to_phase === undefined ? "" : selectedSupport.active_to_phase + 1)}" placeholder="blank = final phase"></label>
      <label class="quick-editor-field"><span>Support inclination</span><input data-qe-support-inclination type="number" step="0.1" value="${escapeHtml(selectedSupport?.inclination_degrees ?? 0)}"></label>
      <label class="quick-editor-field"><span>Support stiffness</span><input data-qe-support-stiffness type="number" step="1" value="${escapeHtml(selectedSupport?.stiffness_kN_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Prestress</span><input data-qe-support-prestress type="number" step="1" value="${escapeHtml(selectedSupport?.prestress_kN_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Capacity</span><input data-qe-support-capacity type="number" step="1" value="${escapeHtml(selectedSupport?.capacity_kN_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Point load</span><input data-qe-support-force type="number" step="1" value="${escapeHtml(selectedSupport?.force_kN_per_m ?? "")}"></label>
      <label class="quick-editor-field"><span>Applied moment</span><input data-qe-support-moment type="number" step="1" value="${escapeHtml(selectedSupport?.moment_kNm_per_m ?? "")}"></label>
      ${project.design_mode === "ec7" && (selectedSupport?.type === "point_load" || selectedSupport?.type === "moment")
        ? `<label class="quick-editor-field"><span>Support action type</span>${ec7ActionTypeSelect("data-qe-support-action-type", selectedSupport.action_type)}</label>`
        : ""}
      <p class="quick-editor-note">Choose an item in its tab to edit the staged project. Use JSON for direct payload changes.${project.wall_type === "diaphragm_wall" ? " The wall uses direct diaphragm section stiffness/cracking/resistance inputs." : ""}</p>
      ${ec7FactorBlock(project)}
    </div>
  `;
  return buildTabbedQuickEditorHtml(flatMarkup);
}

export function reconcileQuickEditorEventPatch(changedField: string, patch: any) {
  const reconciled = { ...patch };
  if (changedField === "top_level_m") {
    delete reconciled.segment_top_level_m;
  } else if (changedField === "toe_level_m") {
    delete reconciled.segment_bottom_level_m;
  } else if (changedField === "segment_top_level_m") {
    delete reconciled.top_level_m;
  } else if (changedField === "segment_bottom_level_m") {
    delete reconciled.toe_level_m;
  } else if (changedField === "design_mode") {
    reconciled.gamma_m0 = defaultSteelGammaM0(reconciled.design_mode);
  }
  return reconciled;
}

export function applyQuickEditorPatch(project: ProjectInput, phaseIndex: number, patch: any, focus: EditorFocusState = {}) {
  const nextProject = structuredClone(project);
  const focusState = normalizeEditorFocus(nextProject, focus);
  nextProject.design_options = {
    ...(nextProject.design_options || {}),
    target_element_length_m:
      patch.target_element_length_m ??
      nextProject.design_options?.target_element_length_m ??
      0.5,
    max_wall_displacement_mm:
      patch.max_wall_displacement_mm ??
      nextProject.design_options?.max_wall_displacement_mm,
  };
  const nextWallLengthSearch = nextProject.design_options?.wall_length_search;
  nextProject.wall_type = patch.wall_type ?? nextProject.wall_type;
  nextProject.design_mode = patch.design_mode ?? nextProject.design_mode;
  nextProject.earth_pressure_method = patch.earth_pressure_method ?? nextProject.earth_pressure_method;
  nextProject.wall_friction_cap = patch.wall_friction_cap ?? nextProject.wall_friction_cap;
  if (nextProject.design_mode === "ec7") {
    nextProject.ec7_partial_factors = {
      ...ec7PartialFactorsForProject(nextProject),
      ...(patch.ec7_partial_factors ?? {}),
      set1: {
        ...ec7PartialFactorsForProject(nextProject).set1,
        ...(patch.ec7_partial_factors?.set1 ?? {}),
      },
      set2: {
        ...ec7PartialFactorsForProject(nextProject).set2,
        ...(patch.ec7_partial_factors?.set2 ?? {}),
      },
    };
  }
  nextProject.wall_geometry.top_level_m = patch.top_level_m ?? nextProject.wall_geometry.top_level_m;
  nextProject.wall_geometry.toe_level_m = patch.toe_level_m ?? nextProject.wall_geometry.toe_level_m;
  nextProject.wall_geometry.inclination_degrees = patch.inclination_degrees ?? nextProject.wall_geometry.inclination_degrees;
  if (nextProject.wall_geometry.segments[0]) {
    nextProject.wall_geometry.segments[0].top_level_m = nextProject.wall_geometry.top_level_m;
  }
  if (nextProject.wall_geometry.segments[nextProject.wall_geometry.segments.length - 1]) {
    nextProject.wall_geometry.segments[nextProject.wall_geometry.segments.length - 1].bottom_level_m = nextProject.wall_geometry.toe_level_m;
  }
  if (patch.toe_mode === "search") {
    const searchStartToeLevelM =
      patch.search_start_toe_level_m ??
      nextWallLengthSearch?.start_toe_level_m ??
      nextProject.wall_geometry.toe_level_m;
    nextProject.design_options = {
      ...(nextProject.design_options || {}),
      wall_length_search: {
        start_toe_level_m: searchStartToeLevelM,
        minimum_toe_level_m:
          patch.search_minimum_toe_level_m ??
          nextWallLengthSearch?.minimum_toe_level_m ??
          searchStartToeLevelM - 1,
        step_m:
          patch.search_step_m ??
          nextWallLengthSearch?.step_m ??
          0.5,
        max_head_displacement_mm:
          patch.search_max_head_displacement_mm ??
          nextWallLengthSearch?.max_head_displacement_mm ??
          60,
      },
    };
    nextProject.wall_geometry.toe_level_m = searchStartToeLevelM;
    if (nextProject.wall_geometry.segments[nextProject.wall_geometry.segments.length - 1]) {
      nextProject.wall_geometry.segments[nextProject.wall_geometry.segments.length - 1].bottom_level_m = searchStartToeLevelM;
    }
  }
  if (patch.toe_mode === "fixed" && nextProject.design_options?.wall_length_search) {
    delete nextProject.design_options.wall_length_search;
  }
  const selectedSegment = nextProject.wall_geometry.segments[focusState.segmentIndex];
  if (selectedSegment) {
    selectedSegment.label =
      patch.segment_label ?? selectedSegment.label;
    selectedSegment.top_level_m =
      patch.segment_top_level_m ?? selectedSegment.top_level_m;
    selectedSegment.bottom_level_m =
      patch.segment_bottom_level_m ?? selectedSegment.bottom_level_m;
    const librarySectionId =
      patch.library_section_id === ""
        ? undefined
        : patch.library_section_id ?? selectedSegment.steel_section?.library_section_id;
    selectedSegment.ei_kNm2_per_m =
      patch.segment_ei_kNm2_per_m ?? selectedSegment.ei_kNm2_per_m;
    selectedSegment.cracked_ei_kNm2_per_m =
      patch.segment_cracked_ei_kNm2_per_m ?? selectedSegment.cracked_ei_kNm2_per_m;
    selectedSegment.cracking_moment_kNm_per_m =
      patch.segment_cracking_moment_kNm_per_m ?? selectedSegment.cracking_moment_kNm_per_m;
    selectedSegment.moment_resistance_kNm_per_m =
      patch.segment_moment_resistance_kNm_per_m ?? selectedSegment.moment_resistance_kNm_per_m;
    selectedSegment.shear_resistance_kN_per_m =
      patch.segment_shear_resistance_kN_per_m ?? selectedSegment.shear_resistance_kN_per_m;
    selectedSegment.steel_section = {
      ...(selectedSegment.steel_section || {}),
      library_section_id: librarySectionId,
      section_name:
        patch.section_name ?? selectedSegment.steel_section?.section_name,
      plastic_section_modulus_cm3_per_m:
        patch.plastic_section_modulus_cm3_per_m ?? selectedSegment.steel_section?.plastic_section_modulus_cm3_per_m,
      shear_area_cm2_per_m:
        patch.shear_area_cm2_per_m ?? selectedSegment.steel_section?.shear_area_cm2_per_m,
      steel_grade_mpa:
        patch.steel_grade_mpa ?? selectedSegment.steel_section?.steel_grade_mpa ?? 355,
      gamma_m0:
        patch.gamma_m0 ??
        selectedSegment.steel_section?.gamma_m0 ??
        defaultSteelGammaM0(nextProject.design_mode),
    };
    if (focusState.segmentIndex === 0 && patch.segment_top_level_m !== undefined) {
      nextProject.wall_geometry.top_level_m = patch.segment_top_level_m;
    }
    if (
      focusState.segmentIndex === nextProject.wall_geometry.segments.length - 1 &&
      patch.segment_bottom_level_m !== undefined
    ) {
      nextProject.wall_geometry.toe_level_m = patch.segment_bottom_level_m;
    }
  }
  if (nextProject.phases[phaseIndex]) {
    nextProject.phases[phaseIndex].name =
      patch.phase_name ?? nextProject.phases[phaseIndex].name;
    nextProject.phases[phaseIndex].surface_profile_left_m =
      patch.surface_profile_left_m ?? nextProject.phases[phaseIndex].surface_profile_left_m;
    nextProject.phases[phaseIndex].surface_profile_right_m =
      patch.surface_profile_right_m ?? nextProject.phases[phaseIndex].surface_profile_right_m;
    nextProject.phases[phaseIndex].strip_surcharges_left =
      patch.strip_surcharges_left ?? nextProject.phases[phaseIndex].strip_surcharges_left;
    nextProject.phases[phaseIndex].strip_surcharges_right =
      patch.strip_surcharges_right ?? nextProject.phases[phaseIndex].strip_surcharges_right;
    nextProject.phases[phaseIndex].surface_level_left_m =
      patch.surface_level_left_m ?? nextProject.phases[phaseIndex].surface_level_left_m;
    nextProject.phases[phaseIndex].surface_level_right_m =
      patch.surface_level_right_m ?? nextProject.phases[phaseIndex].surface_level_right_m;
    nextProject.phases[phaseIndex].excavation_level_left_m =
      patch.excavation_level_left_m ?? nextProject.phases[phaseIndex].excavation_level_left_m;
    nextProject.phases[phaseIndex].excavation_level_right_m =
      patch.excavation_level_right_m ?? nextProject.phases[phaseIndex].excavation_level_right_m;
    nextProject.phases[phaseIndex].groundwater_level_left_m =
      patch.groundwater_level_left_m ?? nextProject.phases[phaseIndex].groundwater_level_left_m;
    nextProject.phases[phaseIndex].groundwater_level_right_m =
      patch.groundwater_level_right_m ?? nextProject.phases[phaseIndex].groundwater_level_right_m;
    nextProject.phases[phaseIndex].surcharge_left_kPa =
      patch.surcharge_left_kPa ?? nextProject.phases[phaseIndex].surcharge_left_kPa;
    nextProject.phases[phaseIndex].surcharge_right_kPa =
      patch.surcharge_right_kPa ?? nextProject.phases[phaseIndex].surcharge_right_kPa;
    nextProject.phases[phaseIndex].surcharge_left_action =
      patch.surcharge_left_action ?? nextProject.phases[phaseIndex].surcharge_left_action;
    nextProject.phases[phaseIndex].surcharge_right_action =
      patch.surcharge_right_action ?? nextProject.phases[phaseIndex].surcharge_right_action;
    nextProject.phases[phaseIndex].vertical_line_load_kN_per_m =
      patch.vertical_line_load_kN_per_m ?? nextProject.phases[phaseIndex].vertical_line_load_kN_per_m;
    nextProject.phases[phaseIndex].vertical_line_load_action =
      patch.vertical_line_load_action ?? nextProject.phases[phaseIndex].vertical_line_load_action;
    nextProject.phases[phaseIndex].include_vertical_line_second_order =
      patch.include_vertical_line_second_order ?? nextProject.phases[phaseIndex].include_vertical_line_second_order;
  }
  const selectedLeftLayer = nextProject.soil_profiles.left.layers[focusState.leftLayerIndex];
  if (selectedLeftLayer) {
    selectedLeftLayer.top_level_m =
      patch.left_top_level_m ?? selectedLeftLayer.top_level_m;
    selectedLeftLayer.bottom_level_m =
      patch.left_bottom_level_m ?? selectedLeftLayer.bottom_level_m;
    selectedLeftLayer.unit_weight_dry_kN_m3 =
      patch.left_unit_weight_dry_kN_m3 ?? selectedLeftLayer.unit_weight_dry_kN_m3;
    selectedLeftLayer.unit_weight_wet_kN_m3 =
      patch.left_unit_weight_wet_kN_m3 ?? selectedLeftLayer.unit_weight_wet_kN_m3;
    selectedLeftLayer.friction_angle_deg =
      patch.left_friction_angle_deg ?? selectedLeftLayer.friction_angle_deg;
    selectedLeftLayer.cohesion_kPa =
      patch.left_cohesion_kPa ?? selectedLeftLayer.cohesion_kPa;
    selectedLeftLayer.wall_friction_deg =
      patch.left_wall_friction_deg ?? selectedLeftLayer.wall_friction_deg;
    selectedLeftLayer.at_rest_coefficient =
      patch.left_at_rest_coefficient ?? selectedLeftLayer.at_rest_coefficient;
    selectedLeftLayer.active_coefficient =
      patch.left_active_coefficient ?? selectedLeftLayer.active_coefficient;
    selectedLeftLayer.passive_coefficient =
      patch.left_passive_coefficient ?? selectedLeftLayer.passive_coefficient;
    selectedLeftLayer.bedding_model =
      patch.left_bedding_model ?? selectedLeftLayer.bedding_model;
    selectedLeftLayer.tri_linear_displacement_breakpoints_mm =
      patch.left_tri_linear_displacement_breakpoints_mm ?? selectedLeftLayer.tri_linear_displacement_breakpoints_mm;
    selectedLeftLayer.tri_linear_stiffness_factors =
      patch.left_tri_linear_stiffness_factors ?? selectedLeftLayer.tri_linear_stiffness_factors;
    selectedLeftLayer.subgrade_modulus_kN_m3 =
      patch.left_subgrade_modulus_kN_m3 ?? selectedLeftLayer.subgrade_modulus_kN_m3;
    selectedLeftLayer.pore_pressure_offset_kPa =
      patch.left_pore_pressure_offset_kPa ?? selectedLeftLayer.pore_pressure_offset_kPa;
  }
  const selectedRightLayer = nextProject.soil_profiles.right.layers[focusState.rightLayerIndex];
  if (selectedRightLayer) {
    selectedRightLayer.top_level_m =
      patch.right_top_level_m ?? selectedRightLayer.top_level_m;
    selectedRightLayer.bottom_level_m =
      patch.right_bottom_level_m ?? selectedRightLayer.bottom_level_m;
    selectedRightLayer.unit_weight_dry_kN_m3 =
      patch.right_unit_weight_dry_kN_m3 ?? selectedRightLayer.unit_weight_dry_kN_m3;
    selectedRightLayer.unit_weight_wet_kN_m3 =
      patch.right_unit_weight_wet_kN_m3 ?? selectedRightLayer.unit_weight_wet_kN_m3;
    selectedRightLayer.friction_angle_deg =
      patch.right_friction_angle_deg ?? selectedRightLayer.friction_angle_deg;
    selectedRightLayer.cohesion_kPa =
      patch.right_cohesion_kPa ?? selectedRightLayer.cohesion_kPa;
    selectedRightLayer.wall_friction_deg =
      patch.right_wall_friction_deg ?? selectedRightLayer.wall_friction_deg;
    selectedRightLayer.at_rest_coefficient =
      patch.right_at_rest_coefficient ?? selectedRightLayer.at_rest_coefficient;
    selectedRightLayer.active_coefficient =
      patch.right_active_coefficient ?? selectedRightLayer.active_coefficient;
    selectedRightLayer.passive_coefficient =
      patch.right_passive_coefficient ?? selectedRightLayer.passive_coefficient;
    selectedRightLayer.bedding_model =
      patch.right_bedding_model ?? selectedRightLayer.bedding_model;
    selectedRightLayer.tri_linear_displacement_breakpoints_mm =
      patch.right_tri_linear_displacement_breakpoints_mm ?? selectedRightLayer.tri_linear_displacement_breakpoints_mm;
    selectedRightLayer.tri_linear_stiffness_factors =
      patch.right_tri_linear_stiffness_factors ?? selectedRightLayer.tri_linear_stiffness_factors;
    selectedRightLayer.subgrade_modulus_kN_m3 =
      patch.right_subgrade_modulus_kN_m3 ?? selectedRightLayer.subgrade_modulus_kN_m3;
    selectedRightLayer.pore_pressure_offset_kPa =
      patch.right_pore_pressure_offset_kPa ?? selectedRightLayer.pore_pressure_offset_kPa;
  }
  const selectedSupport = nextProject.supports[focusState.supportIndex];
  if (selectedSupport) {
    selectedSupport.id =
      patch.support_id ?? selectedSupport.id;
    selectedSupport.type =
      patch.support_type ?? selectedSupport.type;
    selectedSupport.side =
      patch.support_side ?? selectedSupport.side;
    selectedSupport.depth_m =
      patch.support_depth_m ?? selectedSupport.depth_m;
    selectedSupport.active_from_phase =
      patch.support_active_from_phase === undefined
        ? selectedSupport.active_from_phase
        : Math.max(0, Math.round(patch.support_active_from_phase) - 1);
    selectedSupport.active_to_phase =
      patch.support_active_to_phase === null
        ? undefined
        : patch.support_active_to_phase === undefined
        ? selectedSupport.active_to_phase
        : Math.max(0, Math.round(patch.support_active_to_phase) - 1);
    selectedSupport.inclination_degrees =
      patch.support_inclination_degrees ??
      patch.anchor_inclination_degrees ??
      selectedSupport.inclination_degrees;
    selectedSupport.stiffness_kN_per_m =
      patch.support_stiffness_kN_per_m ?? selectedSupport.stiffness_kN_per_m;
    selectedSupport.prestress_kN_per_m =
      patch.support_prestress_kN_per_m ?? selectedSupport.prestress_kN_per_m;
    selectedSupport.capacity_kN_per_m =
      patch.support_capacity_kN_per_m ?? selectedSupport.capacity_kN_per_m;
    selectedSupport.force_kN_per_m =
      patch.support_force_kN_per_m ?? selectedSupport.force_kN_per_m;
    selectedSupport.moment_kNm_per_m =
      patch.support_moment_kNm_per_m ?? selectedSupport.moment_kNm_per_m;
    selectedSupport.action_type =
      patch.support_action_type ?? selectedSupport.action_type;
  }
  return nextProject;
}

function buildSvgPlot(levels: number[], values: number[], cssClass: string, label: string, unit: string) {
  const pairs = levels.map((level, index) => ({ level, value: values[index] }))
    .filter((item, index) => index < values.length && Number.isFinite(item.level) && Number.isFinite(item.value));
  if (!pairs.length) {
    return `<p class="plot-empty">No ${escapeHtml(label.toLowerCase())} array returned.</p>`;
  }

  const width = 260;
  const height = 540;
  const plotLeft = 48;
  const plotRight = 248;
  const plotTop = 62;
  const plotBottom = 488;
  const minLevel = Math.min(...pairs.map((item) => item.level));
  const maxLevel = Math.max(...pairs.map((item) => item.level));
  let minValue = Math.min(0, ...pairs.map((item) => item.value));
  let maxValue = Math.max(0, ...pairs.map((item) => item.value));
  if (maxValue - minValue < 1e-9) {
    minValue = -1;
    maxValue = 1;
  }
  const valuePadding = (maxValue - minValue) * 0.08;
  minValue -= valuePadding;
  maxValue += valuePadding;
  const scaleX = (value: number) => plotLeft + ((value - minValue) / (maxValue - minValue)) * (plotRight - plotLeft);
  const scaleY = (level: number) => plotTop + ((maxLevel - level) / Math.max(1e-9, maxLevel - minLevel)) * (plotBottom - plotTop);
  const zeroX = scaleX(0);
  const curvePoints = pairs.map((item) => `${scaleX(item.value).toFixed(2)},${scaleY(item.level).toFixed(2)}`);
  const linePath = pairs.map((item, index) => `${index === 0 ? "M" : "L"} ${scaleX(item.value).toFixed(2)} ${scaleY(item.level).toFixed(2)}`).join(" ");
  const fillPath = `M ${zeroX.toFixed(2)} ${scaleY(pairs[0].level).toFixed(2)} L ${curvePoints.join(" L ")} L ${zeroX.toFixed(2)} ${scaleY(pairs[pairs.length - 1].level).toFixed(2)} Z`;
  const maxItem = pairs.reduce((extreme, item) => item.value > extreme.value ? item : extreme, pairs[0]);
  const minItem = pairs.reduce((extreme, item) => item.value < extreme.value ? item : extreme, pairs[0]);
  const valueDigits = unit === "mm" || unit === "mrad" ? 2 : 1;
  const maxLabel = `Max ${formatNumber(maxItem.value, valueDigits)} ${unit} @ ${formatNumber(maxItem.level, 2)} m`;
  const minLabel = `Min ${formatNumber(minItem.value, valueDigits)} ${unit} @ ${formatNumber(minItem.level, 2)} m`;
  const levelTicks = Array.from({ length: 5 }, (_, index) => maxLevel - ((maxLevel - minLevel) * index) / 4);
  const xMinimumTick = minValue + valuePadding;
  const xMaximumTick = maxValue - valuePadding;
  const zeroHasLabelSpace = scaleX(0) - scaleX(xMinimumTick) > 36 && scaleX(xMaximumTick) - scaleX(0) > 36;
  const xTicks = zeroHasLabelSpace
    ? [xMinimumTick, 0, xMaximumTick]
    : [xMinimumTick, xMaximumTick].filter((tick, index, ticks) => ticks.findIndex((candidate) => Math.abs(candidate - tick) < 1e-8) === index);
  const color = ({
    displacement: "#0b6e4f",
    rotation: "#527e91",
    moment: "#3a596a",
    shear: "#8f3a3a",
    pressure: "#9b6b43",
    water: "#2f8fda",
  } as Record<string, string>)[cssClass] ?? "#0b6e4f";

  return `
    <svg class="plot-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">
      <text x="4" y="18" font-size="13" font-weight="700" fill="#263235">${escapeHtml(maxLabel)}</text>
      <text x="4" y="38" font-size="13" fill="#465154">${escapeHtml(minLabel)}</text>
      ${levelTicks.map((level) => {
        const y = scaleY(level);
        return `<line x1="${plotLeft}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}" stroke="#d9ddda" stroke-width="1"></line><text x="${plotLeft - 5}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-size="12" fill="#4f5b5e">${formatNumber(level, 1)} m</text>`;
      }).join("")}
      <line x1="${plotLeft}" y1="${plotTop}" x2="${plotLeft}" y2="${plotBottom}" stroke="#465154" stroke-width="1.4"></line>
      <line x1="${zeroX.toFixed(2)}" y1="${plotTop}" x2="${zeroX.toFixed(2)}" y2="${plotBottom}" stroke="#697477" stroke-width="1.4" stroke-dasharray="4 4"></line>
      <path d="${fillPath}" fill="${color}" fill-opacity="0.16" stroke="none"></path>
      <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path>
      <line x1="${plotLeft}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="#465154" stroke-width="1.4"></line>
      ${xTicks.map((tick, index) => {
        const x = scaleX(tick);
        const anchor = index === 0 ? "start" : index === xTicks.length - 1 ? "end" : "middle";
        return `<line x1="${x.toFixed(2)}" y1="${plotBottom}" x2="${x.toFixed(2)}" y2="${plotBottom + 5}" stroke="#465154" stroke-width="1"></line><text x="${x.toFixed(2)}" y="${plotBottom + 18}" text-anchor="${anchor}" font-size="12" fill="#4f5b5e">${formatNumber(tick, valueDigits)}</text>`;
      }).join("")}
      <text x="${plotRight - 1}" y="${height - 10}" text-anchor="end" font-size="12" fill="#263235">${escapeHtml(unit)}</text>
    </svg>
  `;
}

function buildDeformedWallSvg(levels: number[], displacements: number[]) {
  return buildSvgPlot(levels, displacements, "displacement", "Wall deformed shape", "mm")
    .replace('class="plot-svg"', 'class="plot-svg deformed-svg"');
}

function governingSupportCheck(result: any) {
  const supportChecks = result.design_checks?.supports;
  if (!Array.isArray(supportChecks) || !supportChecks.length) {
    return null;
  }
  return supportChecks.reduce((governing: any, item: any) => {
    if (!governing) {
      return item;
    }
    return (item.utilization_ratio ?? 0) >= (governing.utilization_ratio ?? 0) ? item : governing;
  }, null);
}

function hasSupportAxialForce(item: any) {
  return typeof item?.axial_force_kN_per_m === "number";
}

function supportReactionMoment(item: any) {
  if (typeof item?.reaction_moment_kNm_per_m === "number") {
    return item.reaction_moment_kNm_per_m;
  }
  if (item?.type === "moment" && typeof item?.reaction_kN_per_m === "number") {
    return item.reaction_kN_per_m;
  }
  return undefined;
}

function hasSupportAxialCheck(item: any) {
  return (
    typeof item?.axial_demand_kN_per_m === "number" &&
    typeof item?.axial_capacity_kN_per_m === "number"
  );
}

function formatSupportReactionValue(item: any) {
  const supportMoment = supportReactionMoment(item);
  if (supportMoment !== undefined && item?.type === "moment") {
    return `${formatNumber(supportMoment, 2)} kNm/m`;
  }
  const values = [`${formatNumber(item?.reaction_kN_per_m ?? 0, 2)} kN/m`];
  if (supportMoment !== undefined) {
    values.push(`moment ${formatNumber(supportMoment, 2)} kNm/m`);
  }
  if (hasSupportAxialForce(item)) {
    values.push(`axial ${formatNumber(item.axial_force_kN_per_m, 2)} kN/m`);
  }
  return values.join(" · ");
}

function formatSupportReactionStatus(item: any) {
  if (item?.utilization_ratio !== undefined) {
    return `utilization ${formatNumber(item.utilization_ratio, 2)}`;
  }
  return item?.branch_state ?? "n/a";
}

function formatSupportCheckDemandCapacity(item: any) {
  const horizontal = `${formatNumber(item?.demand_kN_per_m ?? 0, 2)} / ${formatNumber(item?.capacity_kN_per_m ?? 0, 2)} kN/m`;
  if (!hasSupportAxialCheck(item)) {
    return horizontal;
  }
  return `${horizontal} · axial ${formatNumber(item.axial_demand_kN_per_m, 2)} / ${formatNumber(item.axial_capacity_kN_per_m, 2)} kN/m`;
}

function renderSupportCheckValueCell(
  primaryValue: number | undefined,
  axialValue: number | undefined
) {
  const primary = `${formatNumber(primaryValue ?? 0, 2)} kN/m`;
  if (typeof axialValue !== "number") {
    return escapeHtml(primary);
  }
  return `${escapeHtml(primary)}<br><span>Axial ${escapeHtml(formatNumber(axialValue, 2))} kN/m</span>`;
}

function formatSupportReactionHorizontalCell(item: any) {
  return `${formatNumber(item?.reaction_kN_per_m ?? 0, 2)} kN/m`;
}

function formatSupportReactionMomentCell(item: any) {
  const supportMoment = supportReactionMoment(item);
  return supportMoment === undefined ? "n/a" : `${formatNumber(supportMoment, 2)} kNm/m`;
}

function formatSupportReactionAxialCell(item: any) {
  return hasSupportAxialForce(item)
    ? `${formatNumber(item.axial_force_kN_per_m, 2)} kN/m`
    : "n/a";
}

function assessmentStatus(value: unknown) {
  if (value === true) return "ASSESSED PASS";
  if (value === false) return "CHECK";
  return "NOT ASSESSED";
}

function serviceabilityAssessmentStatus(serviceability: any) {
  return serviceability?.assessed === true
    ? assessmentStatus(serviceability.pass)
    : "NOT ASSESSED";
}

function formatServiceabilityAssessment(serviceability: any) {
  const maximum = Number.isFinite(serviceability?.max_abs_displacement_mm)
    ? `${formatNumber(serviceability.max_abs_displacement_mm, 2)} mm maximum`
    : "maximum displacement unavailable";
  const limit = Number.isFinite(serviceability?.limit_mm)
    ? `${formatNumber(serviceability.limit_mm, 2)} mm project limit`
    : "project limit not declared";
  return `${maximum} / ${limit} · ${serviceabilityAssessmentStatus(serviceability)}`;
}

function formatSupportReactionDepthCell(item: any) {
  return item?.depth_m === undefined ? "n/a" : `${formatNumber(item.depth_m, 2)} m`;
}

function buildSupportReactionRows(phase: any) {
  if (!Array.isArray(phase?.support_reactions) || !phase.support_reactions.length) {
    return `<tr><td colspan="8">No support rows returned for this phase.</td></tr>`;
  }
  return phase.support_reactions.map((item: any) => `
    <tr>
      <td>${escapeHtml(item.id ?? "n/a")}</td>
      <td>${escapeHtml(item.type ?? "n/a")}</td>
      <td>${escapeHtml(item.side ?? "n/a")}</td>
      <td>${escapeHtml(formatSupportReactionDepthCell(item))}</td>
      <td>${escapeHtml(formatSupportReactionHorizontalCell(item))}</td>
      <td>${escapeHtml(formatSupportReactionMomentCell(item))}</td>
      <td>${escapeHtml(formatSupportReactionAxialCell(item))}</td>
      <td>${escapeHtml(formatSupportReactionStatus(item))}</td>
    </tr>
  `).join("");
}

function buildSupportReactionListItems(phase: any) {
  if (!Array.isArray(phase?.support_reactions) || !phase.support_reactions.length) {
    return `<li>No support rows returned for this phase.</li>`;
  }
  return phase.support_reactions.map((item: any) => {
    const supportMeta = [
      item?.type ?? "support",
      item?.side ?? undefined,
      formatSupportReactionDepthCell(item),
    ].filter((value) => value && value !== "n/a").join(" · ");
    const supportStatus = item?.utilization_ratio !== undefined || item?.branch_state !== undefined
      ? ` · ${formatSupportReactionStatus(item)}`
      : "";
    return `<li>${escapeHtml(item.id ?? "n/a")}${supportMeta ? ` (${escapeHtml(supportMeta)})` : ""}: ${escapeHtml(formatSupportReactionValue(item))}${escapeHtml(supportStatus)}</li>`;
  }).join("");
}

function buildSupportCheckList(result: any) {
  const supportChecks = result.design_checks?.supports;
  if (!Array.isArray(supportChecks) || !supportChecks.length) {
    return `<li>No capacity-based support design checks were triggered.</li>`;
  }
  return supportChecks.map((item: any) => `
    <li>${escapeHtml(item.support_id)} (${escapeHtml(item.support_type ?? "support")}): demand/capacity ${escapeHtml(formatSupportCheckDemandCapacity(item))} · utilization ${formatNumber(item.utilization_ratio ?? 0, 2)} · governing phase ${escapeHtml(item.governing_phase ?? "n/a")} · ${assessmentStatus(item.pass)}</li>
  `).join("");
}

function buildSupportCheckRows(result: any) {
  const supportChecks = result.design_checks?.supports;
  if (!Array.isArray(supportChecks) || !supportChecks.length) {
    return `<tr><td colspan="7">No capacity-based support design checks were triggered.</td></tr>`;
  }
  return supportChecks.map((item: any) => `
    <tr>
      <td>${escapeHtml(item.support_id)}</td>
      <td>${escapeHtml(item.support_type ?? "n/a")}</td>
      <td>${renderSupportCheckValueCell(item.demand_kN_per_m, item.axial_demand_kN_per_m)}</td>
      <td>${renderSupportCheckValueCell(item.capacity_kN_per_m, item.axial_capacity_kN_per_m)}</td>
      <td>${escapeHtml(formatNumber(item.utilization_ratio ?? 0, 2))}</td>
      <td>${escapeHtml(item.governing_phase ?? "n/a")}</td>
      <td>${assessmentStatus(item.pass)}</td>
    </tr>
  `).join("");
}

function buildGlobalGoverningRows(result: any) {
  const governing = result?.governing;
  if (!governing) {
    return `<tr><td colspan="7">No governing envelope metadata returned.</td></tr>`;
  }
  return [
    {
      label: "Displacement",
      minValue: `${formatNumber(governing.min_displacement_mm ?? 0, 2)} mm`,
      maxValue: `${formatNumber(governing.max_displacement_mm ?? 0, 2)} mm`,
      maxAbsValue: `${formatNumber(governing.max_abs_displacement_mm ?? 0, 2)} mm`,
      minPhase: governing.min_displacement_phase ?? "n/a",
      maxPhase: governing.max_displacement_phase ?? "n/a",
      maxAbsPhase: governing.max_abs_displacement_phase ?? "n/a",
    },
    {
      label: "Rotation",
      minValue: `${formatNumber(governing.min_rotation_mrad ?? 0, 2)} mrad`,
      maxValue: `${formatNumber(governing.max_rotation_mrad ?? 0, 2)} mrad`,
      maxAbsValue: `${formatNumber(governing.max_abs_rotation_mrad ?? 0, 2)} mrad`,
      minPhase: governing.min_rotation_phase ?? "n/a",
      maxPhase: governing.max_rotation_phase ?? "n/a",
      maxAbsPhase: governing.max_abs_rotation_phase ?? "n/a",
    },
    {
      label: "Moment",
      minValue: `${formatNumber(governing.min_moment_kNm_per_m ?? 0, 2)} kNm/m`,
      maxValue: `${formatNumber(governing.max_moment_kNm_per_m ?? 0, 2)} kNm/m`,
      maxAbsValue: `${formatNumber(governing.max_abs_moment_kNm_per_m ?? 0, 2)} kNm/m`,
      minPhase: governing.min_moment_phase ?? "n/a",
      maxPhase: governing.max_moment_phase ?? "n/a",
      maxAbsPhase: governing.max_abs_moment_phase ?? "n/a",
    },
    {
      label: "Shear",
      minValue: `${formatNumber(governing.min_shear_kN_per_m ?? 0, 2)} kN/m`,
      maxValue: `${formatNumber(governing.max_shear_kN_per_m ?? 0, 2)} kN/m`,
      maxAbsValue: `${formatNumber(governing.max_abs_shear_kN_per_m ?? 0, 2)} kN/m`,
      minPhase: governing.min_shear_phase ?? "n/a",
      maxPhase: governing.max_shear_phase ?? "n/a",
      maxAbsPhase: governing.max_abs_shear_phase ?? "n/a",
    },
  ].map((item) => `
    <tr>
      <td>${escapeHtml(item.label)}</td>
      <td>${escapeHtml(item.minValue)}</td>
      <td>${escapeHtml(item.maxValue)}</td>
      <td>${escapeHtml(item.maxAbsValue)}</td>
      <td>${escapeHtml(item.minPhase)}</td>
      <td>${escapeHtml(item.maxPhase)}</td>
      <td>${escapeHtml(item.maxAbsPhase)}</td>
    </tr>
  `).join("");
}

function buildWallCheckRows(result: any) {
  const wallCheck = result?.design_checks?.wall;
  const serviceability = result?.design_checks?.serviceability;
  if (!wallCheck) {
    return [
      ["Wall design check", "No wall design-check metadata returned."],
      ["Displacement serviceability", formatServiceabilityAssessment(serviceability)],
      ["Overall assessed checks", assessmentStatus(result?.design_checks?.overall_pass)],
    ].map(([label, value]) => `
      <tr>
        <td>${escapeHtml(label)}</td>
        <td>${escapeHtml(value)}</td>
      </tr>
    `).join("");
  }
  return [
    ["Wall type", (wallCheck.wall_type ?? "n/a").replaceAll("_", " ")],
    ["Governing check", wallCheck.governing_check ?? "n/a"],
    ["Governing phase", wallCheck.governing_phase ?? "n/a"],
    ["Governing level", `${formatNumber(wallCheck.governing_level_m ?? 0, 2)} m`],
    ["Bending demand / capacity", `${formatNumber(wallCheck.bending_demand_kNm_per_m ?? 0, 2)} / ${formatNumber(wallCheck.bending_capacity_kNm_per_m ?? 0, 2)} kNm/m`],
    ["Bending governing point", `${wallCheck.bending_governing_phase ?? "n/a"} · ${formatNumber(wallCheck.bending_governing_level_m ?? 0, 2)} m`],
    ["Bending utilization", formatNumber(wallCheck.bending_utilization ?? 0, 2)],
    ["Shear demand / capacity", `${formatNumber(wallCheck.shear_demand_kN_per_m ?? 0, 2)} / ${formatNumber(wallCheck.shear_capacity_kN_per_m ?? 0, 2)} kN/m`],
    ["Shear governing point", `${wallCheck.shear_governing_phase ?? "n/a"} · ${formatNumber(wallCheck.shear_governing_level_m ?? 0, 2)} m`],
    ["Shear utilization", formatNumber(wallCheck.shear_utilization ?? 0, 2)],
    ["Cracked stiffness state", wallCheck.cracked_stiffness_state ?? "n/a"],
    ["Wall assessment", assessmentStatus(wallCheck.pass)],
    ["Displacement serviceability", formatServiceabilityAssessment(serviceability)],
    ["Overall assessed checks", assessmentStatus(result?.design_checks?.overall_pass)],
  ].map(([label, value]) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(value)}</td>
    </tr>
  `).join("");
}

function buildSampledResultRows(phase: any) {
  if (!phase?.sampled_results?.length) {
    return `<tr><td colspan="11">No sampled results returned for this phase.</td></tr>`;
  }
  return phase.sampled_results.map((item: any) => `
    <tr>
      <td>${escapeHtml(formatNumber(item.level_m ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.depth_m ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.displacement_mm ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.rotation_mrad ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.moment_kNm_per_m ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.shear_kN_per_m ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.net_soil_pressure_kPa ?? 0, 2))}</td>
      <td>${escapeHtml(formatNumber(item.water_pressure_kPa ?? 0, 2))}</td>
      <td>${escapeHtml(item.branch_state ?? "n/a")}</td>
      <td>${escapeHtml(item.left_branch ?? "n/a")}</td>
      <td>${escapeHtml(item.right_branch ?? "n/a")}</td>
    </tr>
  `).join("");
}

const REMOVED_WARNING_CODES = new Set(["FIRST_PASS_EC7_FACTORS", "BENCHMARK_IMPORTS_PENDING"]);

export function readableWarningMessage(code: string) {
  if (REMOVED_WARNING_CODES.has(code)) return "";
  const nonConverged = /^EC7_PHASE_DID_NOT_CONVERGE:(set1|set2):(.+)$/.exec(code);
  if (nonConverged) {
    const setNumber = nonConverged[1] === "set1" ? 1 : 2;
    return `EC7 set ${setNumber}: phase “${nonConverged[2]}” has no equilibrium — ULS verification fails`;
  }
  const seededPhase = /^EC7_ULS_NOT_EVALUATED_FOR_SEEDED_PHASE:(.+)$/.exec(code);
  if (seededPhase) {
    return `EC7 ULS verification was not evaluated for seeded phase “${seededPhase[1]}”.`;
  }
  if (code === "DIAPHRAGM_WALL_CONSTANT_EI") {
    return "Diaphragm wall uses constant bending stiffness EI; a moment-curvature relation is not modelled.";
  }
  if (code === "CULMANN_PHI_RANGE_OVER_15_DEG") {
    return "Culmann validity warning: soil friction angles along the wall differ by more than 15 degrees, so one straight slip plane is outside the method's validity (CUR 166 4.5.8).";
  }
  return code;
}

function readableWarnings(warnings: unknown) {
  return (Array.isArray(warnings) ? warnings : [])
    .map((item) => readableWarningMessage(String(item)))
    .filter(Boolean);
}

function buildResultProvenanceList(result: any) {
  const warnings = Array.isArray(result?.warnings) ? result.warnings : [];
  const assumptions = result?.ec7_verification
    ? ["See the EC7 verification tables for partial factors, design effects and overdig."]
    : Array.isArray(result?.assumptions) ? result.assumptions : [];
  const sourceRefs = result?.ec7_verification ? [] : Array.isArray(result?.source_refs) ? result.source_refs : [];
  return [
    `<li>Formula version: ${escapeHtml(result?.formula_version || "n/a")}</li>`,
    `<li>Warnings: ${readableWarnings(warnings).length ? readableWarnings(warnings).map((item) => escapeHtml(item)).join(", ") : "none"}</li>`,
    `<li>Assumptions: ${assumptions.length ? assumptions.map((item: string) => escapeHtml(item)).join(" | ") : "none"}</li>`,
    `<li>Source refs: ${sourceRefs.length ? sourceRefs.map((item: string) => escapeHtml(item)).join(" | ") : "none"}</li>`,
  ].join("");
}

export function buildPhaseOverview(result: any, phaseIndex: number, view: ResultDesignView = "characteristic") {
  const phase = resultPhaseForView(result, phaseIndex, view);
  const overallPass = assessmentStatus(result.design_checks?.overall_pass);
  const serviceability = result.design_checks?.serviceability;
  const supportCheck = governingSupportCheck(result);
  const phaseSolverStatus = phase?.converged === false
    ? `Did not converge after ${phase?.iterations ?? "n/a"} iteration(s)`
    : `Converged in ${phase?.iterations ?? "n/a"} iteration(s)`;
  return [
    {
      title: "Selected-phase displacement",
      text: `${formatNumber(phase.envelope.max_abs_displacement_mm, 2)} mm`,
    },
    {
      title: "Selected-phase moment",
      text: `${formatNumber(phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m`,
    },
    {
      title: "Selected-phase plastic offset",
      text: `${formatNumber(phase.envelope.max_abs_plastic_offset_mm ?? 0, 2)} mm`,
    },
    {
      title: "Displacement serviceability",
      text: formatServiceabilityAssessment(serviceability),
    },
    {
      title: "Wall utilization",
      text: `${formatNumber(result.design_checks?.wall?.bending_utilization ?? 0, 2)} bending · ${formatNumber(result.design_checks?.wall?.shear_utilization ?? 0, 2)} shear`,
    },
    {
      title: "Governing support",
      text: supportCheck
        ? `${supportCheck.support_id} · ${formatSupportCheckDemandCapacity(supportCheck)} · ${supportCheck.governing_phase ?? phase.name}`
        : "No support capacity checks",
    },
    {
      title: "Phase solver status",
      text: phaseSolverStatus,
    },
    {
      title: "Assessment status",
      text: `${overallPass} · ${result.design_checks?.wall?.governing_phase || phase.name}`,
    },
  ];
}

export function buildResultSummaryItems(result: any, phaseIndex = 0) {
  const phase = result?.phases?.[phaseIndex];
  if (!phase) {
    return [];
  }
  const supportCheck = governingSupportCheck(result);
  const wallCheck = result?.design_checks?.wall;
  const serviceability = result?.design_checks?.serviceability;
  const governing = result?.governing;
  const summary = [
    `Phase: ${phase.name}`,
    `Phase solver status: ${phase?.converged === false ? `did not converge after ${phase?.iterations ?? "n/a"} iteration(s)` : `converged in ${phase?.iterations ?? "n/a"} iteration(s)`}`,
    `Selected-phase max displacement: ${formatNumber(phase.envelope.max_abs_displacement_mm, 2)} mm`,
    `Selected-phase max moment: ${formatNumber(phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m`,
    `Selected-phase max shear: ${formatNumber(phase.envelope.max_abs_shear_kN_per_m, 2)} kN/m`,
    `Selected-phase max plastic offset: ${formatNumber(phase.envelope.max_abs_plastic_offset_mm ?? 0, 2)} mm`,
    `Global displacement range: ${formatNumber(governing?.min_displacement_mm ?? 0, 2)} to ${formatNumber(governing?.max_displacement_mm ?? phase.envelope.max_abs_displacement_mm, 2)} mm`,
    `Global rotation range: ${formatNumber(governing?.min_rotation_mrad ?? 0, 2)} to ${formatNumber(governing?.max_rotation_mrad ?? 0, 2)} mrad`,
    `Global moment range: ${formatNumber(governing?.min_moment_kNm_per_m ?? 0, 2)} to ${formatNumber(governing?.max_moment_kNm_per_m ?? phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m`,
    `Global shear range: ${formatNumber(governing?.min_shear_kN_per_m ?? 0, 2)} to ${formatNumber(governing?.max_shear_kN_per_m ?? phase.envelope.max_abs_shear_kN_per_m, 2)} kN/m`,
    `Governing |rotation|: ${formatNumber(governing?.max_abs_rotation_mrad ?? 0, 2)} mrad (${governing?.max_abs_rotation_phase ?? phase.name})`,
    `Governing |moment|: ${formatNumber(governing?.max_abs_moment_kNm_per_m ?? phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m (${governing?.max_abs_moment_phase ?? phase.name})`,
    `Wall bending demand/capacity: ${formatNumber(result.design_checks?.wall?.bending_demand_kNm_per_m ?? 0, 2)} / ${formatNumber(result.design_checks?.wall?.bending_capacity_kNm_per_m ?? 0, 2)} kNm/m`,
    `Wall bending utilization: ${formatNumber(result.design_checks?.wall?.bending_utilization ?? 0, 2)}`,
    `Wall shear demand/capacity: ${formatNumber(result.design_checks?.wall?.shear_demand_kN_per_m ?? 0, 2)} / ${formatNumber(result.design_checks?.wall?.shear_capacity_kN_per_m ?? 0, 2)} kN/m`,
    `Wall governing level: ${formatNumber(wallCheck?.governing_level_m ?? 0, 2)} m`,
    `Wall assessment: ${assessmentStatus(wallCheck?.pass).toLowerCase()}`,
    `Displacement serviceability: ${formatServiceabilityAssessment(serviceability).toLowerCase()}`,
    supportCheck
      ? `Governing support demand/capacity: ${formatSupportCheckDemandCapacity(supportCheck)} (${supportCheck.support_id} · ${supportCheck.governing_phase})`
      : "Governing support utilization: n/a",
    `Overall assessed checks: ${assessmentStatus(result.design_checks?.overall_pass).toLowerCase()}`,
  ];
  if (result.search_evaluation) {
    summary.push(
      `Wall-length search selected toe: ${formatNumber(result.search_evaluation.selected_toe_level_m, 1)} m`,
      `Wall-length search stop reason: ${result.search_evaluation.stop_reason}`
    );
  }
  for (const [index, setResult] of (result?.ec7_verification?.sets ?? []).entries()) {
    const number = setResult.set === "set1" ? 1 : setResult.set === "set2" ? 2 : index + 1;
    summary.push(
      `EC7 set ${number}: governing |M| ${formatNumber(setResult.governing?.max_abs_moment_kNm_per_m ?? 0, 2)} kNm/m; governing |V| ${formatNumber(setResult.governing?.max_abs_shear_kN_per_m ?? 0, 2)} kN/m; ${setResult.converged === true ? "all phases converged" : "one or more phases did not converge"}`
    );
    for (const failedPhase of (setResult.phases ?? []).filter((item: any) => item?.converged === false)) {
      summary.push(readableWarningMessage(`EC7_PHASE_DID_NOT_CONVERGE:set${number}:${failedPhase.name ?? "n/a"}`));
    }
  }
  return summary;
}

/**
 * A phase that did not converge has no equilibrium state (typically a wall
 * that is unstable in that phase); its numbers must not be read as results,
 * and later phases start from that invalid state.
 */
export function buildPhaseConvergenceAlert(result: any, phaseIndex: number) {
  const phase = result?.phases?.[phaseIndex];
  if (phase?.converged === false) {
    return `<div class="phase-alert" role="alert"><strong>No equilibrium found in this phase.</strong> The solver stopped after ${escapeHtml(phase?.iterations ?? "n/a")} iterations. This usually means the wall is unstable here: insufficient embedment, or anchors/props at their capacity. The plotted values are not a valid result — lengthen the wall or add support and run again.</div>`;
  }
  const earlierFailure = (result?.phases ?? [])
    .slice(0, Math.max(0, phaseIndex))
    .find((item: any) => item?.converged === false);
  if (earlierFailure) {
    return `<div class="phase-alert" role="alert"><strong>An earlier phase did not converge</strong> (${escapeHtml(earlierFailure.name)}). This phase starts from that invalid state, so its values are not a valid result.</div>`;
  }
  return "";
}

const EC7_FACTOR_DISPLAY_ROWS: Array<{ key: keyof typeof EC7_PARTIAL_FACTOR_DEFAULTS.set1; label: string; percent?: boolean }> = [
  { key: "permanent_unfavourable", label: "Permanent load, unfavourable (×)" },
  { key: "permanent_favourable", label: "Permanent load, favourable (×)" },
  { key: "variable_unfavourable", label: "Variable load, unfavourable (×)" },
  { key: "variable_favourable", label: "Variable load, favourable (×)" },
  { key: "tan_phi", label: "tan φ′ (÷)" },
  { key: "cohesion", label: "Cohesion (÷)" },
  { key: "subgrade_modulus", label: "Subgrade modulus (÷)" },
  { key: "effect", label: "Factor on effects M, V, support forces (×)" },
  { key: "overdig_fraction", label: "Overdig (% of H)", percent: true },
  { key: "overdig_max_m", label: "Overdig maximum (m)" },
];

function ec7FactorValue(factors: any, row: (typeof EC7_FACTOR_DISPLAY_ROWS)[number]) {
  const value = Number(factors?.[row.key] ?? 0);
  return formatNumber(row.percent ? value * 100 : value, row.percent ? 1 : 2);
}

function ec7SupportForceEnvelope(setResult: any) {
  const maximums = new Map<string, { force: number; axial?: number; moment?: number; phase: string }>();
  for (const phase of setResult?.phases ?? []) {
    if (phase?.converged === false) continue;
    for (const reaction of phase?.support_reactions ?? []) {
      const id = String(reaction?.id ?? "Support");
      const force = Number(reaction?.reaction_kN_per_m ?? 0);
      const axial = typeof reaction?.axial_force_kN_per_m === "number" ? reaction.axial_force_kN_per_m : undefined;
      const moment = supportReactionMoment(reaction);
      const previous = maximums.get(id);
      if (!previous || Math.abs(force) > Math.abs(previous.force)) {
        maximums.set(id, { force, axial, moment, phase: phase.name ?? "n/a" });
      }
    }
  }
  if (!maximums.size) return "No converged support-force results";
  return [...maximums.entries()].map(([id, item]) => {
    const details = [`${formatNumber(item.force, 2)} kN/m`];
    if (item.axial !== undefined) details.push(`axial ${formatNumber(item.axial, 2)} kN/m`);
    if (item.moment !== undefined) details.push(`${formatNumber(item.moment, 2)} kNm/m`);
    return `${id}: ${details.join(" · ")} (${item.phase})`;
  }).join("; ");
}

export function buildEc7VerificationHtml(result: any) {
  const verification = result?.ec7_verification;
  if (!verification) return "";
  const sets = ["set1", "set2"].map((setName) =>
    verification.sets?.find((item: any) => item?.set === setName) ?? null
  );
  const partialFactors = verification.partial_factors ?? {};
  const factorRows = EC7_FACTOR_DISPLAY_ROWS.map((row) => `
    <tr><th scope="row">${row.label}</th><td>${ec7FactorValue(partialFactors.set1, row)}</td><td>${ec7FactorValue(partialFactors.set2, row)}</td></tr>
  `).join("");
  const summaryRows = sets.map((setResult: any, index: number) => {
    const governing = setResult?.governing ?? {};
    const setNumber = index + 1;
    const allConverged = setResult?.converged === true && (setResult?.phases ?? []).every((phase: any) => phase?.converged !== false);
    return `<tr><th scope="row">Set ${setNumber}</th><td>${formatNumber(governing.max_abs_moment_kNm_per_m ?? 0, 2)} kNm/m (${escapeHtml(governing.max_abs_moment_phase ?? "n/a")})</td><td>${formatNumber(governing.max_abs_shear_kN_per_m ?? 0, 2)} kN/m (${escapeHtml(governing.max_abs_shear_phase ?? "n/a")})</td><td>${escapeHtml(ec7SupportForceEnvelope(setResult))}</td><td>${allConverged ? "All phases converged" : "One or more phases did not converge"}</td></tr>`;
  }).join("");
  const phaseNames = [...new Set(sets.flatMap((setResult: any) => (setResult?.overdig ?? []).map((item: any) => item.phase)))];
  const overdigRows = phaseNames.map((phaseName) => {
    const first = sets[0]?.overdig?.find((item: any) => item.phase === phaseName);
    const second = sets[1]?.overdig?.find((item: any) => item.phase === phaseName);
    const side = first?.side ?? second?.side ?? "—";
    const height = first?.height_m ?? second?.height_m;
    return `<tr><td>${escapeHtml(phaseName)}</td><td>${escapeHtml(side)}</td><td>${height === undefined ? "—" : formatNumber(height, 2)}</td><td>${first ? formatNumber(first.overdig_m ?? 0, 3) : "—"}</td><td>${second ? formatNumber(second.overdig_m ?? 0, 3) : "—"}</td></tr>`;
  }).join("");
  const failureAlerts = sets.flatMap((setResult: any, index: number) =>
    (setResult?.phases ?? []).filter((phase: any) => phase?.converged === false).map((phase: any) =>
      `<div class="phase-alert" role="alert"><strong>EC7 set ${index + 1}: phase &ldquo;${escapeHtml(phase.name ?? "n/a")}&rdquo; has no equilibrium &mdash; ULS verification fails</strong></div>`
    )
  ).join("");
  return `
    <article class="result-card result-card-wide ec7-verification" aria-labelledby="ec7-verification-title">
      <h3 id="ec7-verification-title">EC7 verification</h3>
      <p>EC7-BE design approach 1 with sets 1 and 2. Moments, shear and support forces use the factor on effects; displacements remain unfactored.</p>
      ${failureAlerts}
      <h4>Partial factors used</h4>
      <div class="table-shell"><table><thead><tr><th>Factor</th><th>Set 1</th><th>Set 2</th></tr></thead><tbody>${factorRows}</tbody></table></div>
      <h4>Governing design effects and convergence</h4>
      <div class="table-shell"><table><thead><tr><th>Set</th><th>Governing |M|</th><th>Governing |V|</th><th>Governing support forces</th><th>Convergence</th></tr></thead><tbody>${summaryRows}</tbody></table></div>
      <h4>Overdig by phase</h4>
      <div class="table-shell"><table><thead><tr><th>Phase</th><th>Side</th><th>H (m)</th><th>Δa Set 1 (m)</th><th>Δa Set 2 (m)</th></tr></thead><tbody>${overdigRows || `<tr><td colspan="5">No overdig rows returned.</td></tr>`}</tbody></table></div>
    </article>`;
}

function buildResultViewToolbar(result: any, view: ResultDesignView) {
  if (!result?.ec7_verification) return "";
  return `<div class="result-view-toolbar"><label class="phase-control"><span>Results view</span><select class="phase-select" data-result-design-view aria-label="Results view"><option value="characteristic" ${view === "characteristic" ? "selected" : ""}>Characteristic (SLS)</option><option value="set1" ${view === "set1" ? "selected" : ""}>EC7 set 1</option><option value="set2" ${view === "set2" ? "selected" : ""}>EC7 set 2</option></select></label>${view === "characteristic" ? "" : `<p class="result-status">Moment and shear values are design values; displacements are unfactored.</p>`}</div>`;
}

export function buildResultHtml(result: any, phaseIndex: number, view: ResultDesignView = "characteristic") {
  const phase = resultPhaseForView(result, phaseIndex, view);
  const convergenceAlert = view === "characteristic" ? buildPhaseConvergenceAlert(result, phaseIndex) : "";
  const wallLengthSearch = result.search_evaluation;
  const plotData = buildPhasePlotData(result, phaseIndex, view);
  const { levels, displacement, rotation, moment, shear, pressure, waterPressure, source } = plotData;
  const steppedShear = buildSteppedShearSeries(result, phaseIndex, view === "characteristic" ? undefined : phase);
  const earthPressureMethod = result?.earth_pressure_method ?? result?.normalized_input?.earth_pressure_method ?? "coulomb";
  const wallFrictionCap = result?.wall_friction_cap ?? result?.normalized_input?.wall_friction_cap ?? "phi_over_3";
  const earthPressureMethodLabel = earthPressureMethod === "culmann"
    ? "Culmann (sloping surface and strip loads)"
    : "Coulomb (horizontal surface)";
  const wallFrictionCapLabel = wallFrictionCap === "cur166"
    ? "CUR 166 (passive side)"
    : wallFrictionCap === "none" ? "Input δ" : "δ ≤ φ/3";

  const cards = buildPhaseOverview(result, phaseIndex, view).map((card) => `
    <article class="result-card">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
  const plotCards = [
    { title: "Displacement · mm", values: displacement, color: "displacement", label: "Displacement plot", unit: "mm", quantity: "displacement array" },
    { title: "Moment · kNm/m", values: moment, color: "moment", label: "Moment plot", unit: "kNm/m", quantity: "moment array" },
    { title: "Shear · kN/m", values: steppedShear?.values ?? shear, levels: steppedShear?.levels, color: "shear", label: "Shear plot", unit: "kN/m", quantity: steppedShear ? "shear above/below each node" : "shear array" },
    { title: "Net soil pressure · kPa", values: pressure, color: "pressure", label: "Net pressure plot", unit: "kPa", quantity: "net soil pressure array" },
    { title: "Water pressure · kPa", values: waterPressure, color: "water", label: "Water pressure plot", unit: "kPa", quantity: "water-pressure array" },
  ].map((plot) => `
    <article class="depth-plot-card">
      <h3>${escapeHtml(view !== "characteristic" && (plot.color === "moment" || plot.color === "shear") ? `${plot.color === "moment" ? "Moment" : "Shear"} design value · ${plot.color === "moment" ? "kNm/m" : "kN/m"}` : plot.title)}</h3>
      <p class="plot-source sr-only">${escapeHtml(plotSourceDescription(source, plot.quantity))}</p>
      ${buildSvgPlot((plot as { levels?: number[] }).levels ?? levels, plot.values, plot.color, view !== "characteristic" && (plot.color === "moment" || plot.color === "shear") ? `${plot.color === "moment" ? "Moment" : "Shear"} design value plot` : plot.label, plot.unit)}
    </article>
  `).join("");
  const rotationPlot = `
    <details class="depth-plot-card additional-plot-card">
      <summary>Rotation · mrad</summary>
      <p class="plot-source sr-only">${escapeHtml(plotSourceDescription(source, "rotation array"))}</p>
      ${buildSvgPlot(levels, rotation, "rotation", "Rotation plot", "mrad")}
    </details>
  `;

  return `
    ${buildResultViewToolbar(result, view)}
    ${convergenceAlert}
    <article class="result-card result-card-wide earth-pressure-result"><h3>Earth-pressure assumptions</h3><p>Method: ${escapeHtml(earthPressureMethodLabel)}. Wall friction limit: ${escapeHtml(wallFrictionCapLabel)}.</p></article>
    <div class="depth-plot-grid" aria-label="Selected phase depth plots">
      ${plotCards}
      ${rotationPlot}
    </div>
    <div class="result-grid">
      ${cards}
    </div>
    ${buildEc7VerificationHtml(result)}
    ${wallLengthSearch ? `
    <article class="result-card result-card-wide">
      <h3>Wall-length search</h3>
      <p>Selected toe ${formatNumber(wallLengthSearch.selected_toe_level_m, 1)} m after ${wallLengthSearch.trial_count} trial(s). Stop reason: ${escapeHtml(wallLengthSearch.stop_reason)}.</p>
    </article>` : ""}
    <article class="result-card result-card-wide">
      <h3>Solver discretization</h3>
      <p>${escapeHtml(buildDiscretizationSummary(result))}</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Node</th><th>Level</th><th>Next element</th></tr>
          </thead>
          <tbody>${buildDiscretizationRows(result)}</tbody>
        </table>
      </div>
    </article>
    <article class="result-card result-card-wide">
      <h3>Solver provenance</h3>
      <p>Formula version, warnings, assumptions, and source references returned directly by the API for this run.</p>
      <ul class="result-meta-list">${buildResultProvenanceList(result)}</ul>
    </article>
    <article class="result-card result-card-wide">
      <h3>Global governing envelope</h3>
      <p>Backend-authored signed minima/maxima plus absolute extrema across all phases, including the controlling phase for each quantity.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Quantity</th><th>Min</th><th>Max</th><th>Max |abs|</th><th>Min phase</th><th>Max phase</th><th>Abs phase</th></tr>
          </thead>
          <tbody>${buildGlobalGoverningRows(result)}</tbody>
        </table>
      </div>
    </article>
    <article class="result-card result-card-wide">
      <h3>Wall design check</h3>
      <p>Explicit wall design-check metadata returned by the API, including governing level and pass state.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Check field</th><th>Value</th></tr>
          </thead>
          <tbody>${buildWallCheckRows(result)}</tbody>
        </table>
      </div>
    </article>
    <article class="result-card result-card-wide">
      <h3>Support design checks</h3>
      <p>Capacity-based support demand/capacity outputs returned by the API.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Support</th><th>Type</th><th>Demand</th><th>Capacity</th><th>Utilization</th><th>Governing phase</th><th>Status</th></tr>
          </thead>
          <tbody>${buildSupportCheckRows(result)}</tbody>
        </table>
      </div>
    </article>
    <article class="result-card result-card-wide">
      <h3>Wall deformed shape</h3>
      <p>${escapeHtml(plotSourceDescription(source, "displacement array"))}</p>
      ${buildDeformedWallSvg(levels, displacement)}
    </article>
    <article class="result-card">
      <h3>Support-force table</h3>
      <p>Selected-phase support output with explicit horizontal force, moment, axial force, and utilization/state columns.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Support</th><th>Type</th><th>Side</th><th>Depth</th><th>Horizontal force</th><th>Moment</th><th>Axial force</th><th>Utilization / State</th></tr>
          </thead>
          <tbody>${buildSupportReactionRows(phase)}</tbody>
        </table>
      </div>
    </article>
    <article class="result-card result-card-wide">
      <h3>Sampled numerical output</h3>
      <p>Depth-wise API response table used for the plots and report without client-side engineering recomputation.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Level</th><th>Depth</th><th>Disp.</th><th>Rot.</th><th>Moment</th><th>Shear</th><th>Net p</th><th>Water p</th><th>Branch</th><th>Left</th><th>Right</th></tr>
          </thead>
          <tbody>${buildSampledResultRows(phase)}</tbody>
        </table>
      </div>
    </article>
  `;
}

export function buildResultDownloadText(project: ProjectInput, result: any) {
  const analyzedProject = resolveAnalyzedProject(project, result);
  const downloadableResult = structuredClone(result);
  if (downloadableResult?.ec7_verification) {
    downloadableResult.ec7_verification.procedure = "EC7-BE design approach 1, sets 1 and 2.";
    downloadableResult.assumptions = (downloadableResult.assumptions ?? []).filter((item: string) =>
      !/^EC7 verification:|^The partial factors can be changed/.test(item)
    );
  }
  return formatJson({
    project: analyzedProject,
    result: downloadableResult,
    ...(downloadableResult?.ec7_verification
      ? {
          ec7_verification_summary: buildEc7VerificationHtml(downloadableResult)
            .replace(/<[^>]*>/g, " ")
            .replaceAll("&ldquo;", "“")
            .replaceAll("&rdquo;", "”")
            .replaceAll("&mdash;", "—")
            .replaceAll("&amp;", "&")
            .replace(/\s+/g, " ")
            .trim(),
        }
      : {}),
  });
}

export function buildResultFilename(project: ProjectInput, date = new Date()) {
  const stamp = date.toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
  return `ea-suys-${normalizeFileSlug(project.wall_type)}-${project.design_mode}-${stamp}.json`;
}

export function buildReportFilename(project: ProjectInput, date = new Date()) {
  return buildResultFilename(project, date).replace(/\.json$/, ".html");
}

export function buildReportPreviewHtml(project: ProjectInput, result: any, phaseIndex: number) {
  const phase = result.phases[phaseIndex];
  const displayProject = resolveAnalyzedProject(project, result);
  const wallSection = buildWallSectionMetadata(displayProject);
  const wallLengthSearch = result.search_evaluation;
  const supportCheck = governingSupportCheck(result);
  const wallCheck = result?.design_checks?.wall;
  const governing = result?.governing;
  return `
    <article class="report-card">
      <h3>HTML report export</h3>
      <p>The exported report includes project metadata, the selected phase summary, design checks, warnings, assumptions, and source references.</p>
      <ul class="report-list">
        ${buildResultSummaryItems(result, phaseIndex).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        <li>Wall type: ${escapeHtml(displayProject.wall_type.replaceAll("_", " "))}</li>
        <li>${escapeHtml(wallSection.label)}: ${escapeHtml(wallSection.value)}</li>
        <li>Wall inclination: ${formatNumber(displayProject.wall_geometry.inclination_degrees ?? 0, 1)}°</li>
        <li>Phase vertical wall load: ${formatNumber(phase.normalized_vertical_line_load_kN_per_m ?? phase.vertical_line_load_kN_per_m ?? displayProject.phases[phaseIndex]?.vertical_line_load_kN_per_m ?? 0, 1)} kN/m</li>
        <li>Target element length: ${formatNumber(targetElementLengthForProject(displayProject), 2)} m</li>
        <li>Max wall displacement (project limit): ${Number.isFinite(displayProject.design_options?.max_wall_displacement_mm) ? `${formatNumber(displayProject.design_options?.max_wall_displacement_mm as number, 2)} mm` : "not declared"}</li>
        <li>Toe control: ${wallLengthSearch ? `search selected ${formatNumber(wallLengthSearch.selected_toe_level_m, 1)} m after ${wallLengthSearch.trial_count} trial(s)` : `fixed toe ${formatNumber(displayProject.wall_geometry.toe_level_m, 1)} m`}</li>
        <li>Discretization: ${escapeHtml(buildDiscretizationSummary(result))}</li>
        <li>Global displacement range: ${formatNumber(governing?.min_displacement_mm ?? 0, 2)} to ${formatNumber(governing?.max_displacement_mm ?? phase.envelope.max_abs_displacement_mm, 2)} mm</li>
        <li>Global rotation range: ${formatNumber(governing?.min_rotation_mrad ?? 0, 2)} to ${formatNumber(governing?.max_rotation_mrad ?? 0, 2)} mrad</li>
        <li>Global moment range: ${formatNumber(governing?.min_moment_kNm_per_m ?? 0, 2)} to ${formatNumber(governing?.max_moment_kNm_per_m ?? phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m</li>
        <li>Global shear range: ${formatNumber(governing?.min_shear_kN_per_m ?? 0, 2)} to ${formatNumber(governing?.max_shear_kN_per_m ?? phase.envelope.max_abs_shear_kN_per_m, 2)} kN/m</li>
        <li>Governing |rotation|: ${formatNumber(governing?.max_abs_rotation_mrad ?? 0, 2)} mrad (${escapeHtml(governing?.max_abs_rotation_phase ?? phase.name)})</li>
        <li>Governing |moment|: ${formatNumber(governing?.max_abs_moment_kNm_per_m ?? phase.envelope.max_abs_moment_kNm_per_m, 2)} kNm/m (${escapeHtml(governing?.max_abs_moment_phase ?? phase.name)})</li>
        <li>Wall governing level: ${formatNumber(wallCheck?.governing_level_m ?? 0, 2)} m</li>
        <li>Wall governing check: ${escapeHtml(wallCheck?.governing_check ?? "n/a")} · demand/capacity ${formatNumber(wallCheck?.governing_check === "shear" ? wallCheck?.shear_demand_kN_per_m ?? 0 : wallCheck?.bending_demand_kNm_per_m ?? 0, 2)} / ${formatNumber(wallCheck?.governing_check === "shear" ? wallCheck?.shear_capacity_kN_per_m ?? 0 : wallCheck?.bending_capacity_kNm_per_m ?? 0, 2)} ${wallCheck?.governing_check === "shear" ? "kN/m" : "kNm/m"}</li>
        <li>Governing support check: ${supportCheck ? `${escapeHtml(supportCheck.support_id)} · demand/capacity ${escapeHtml(formatSupportCheckDemandCapacity(supportCheck))} · utilization ${formatNumber(supportCheck.utilization_ratio ?? 0, 2)} · ${escapeHtml(supportCheck.governing_phase ?? phase.name)}` : "none"}</li>
        <li>Warnings: ${escapeHtml(readableWarnings(result.warnings).join(", ") || "none")}</li>
      </ul>
      <p class="report-note">Selected phase: ${escapeHtml(phase.name)}</p>
    </article>
  `;
}

export function buildReportHtml(
  project: ProjectInput,
  result: any,
  phaseIndex = 0,
  generatedAt = new Date(),
  resultView: ResultDesignView = "characteristic"
) {
  const displayProject = resolveAnalyzedProject(project, result);
  const wallSection = buildWallSectionMetadata(displayProject);
  const phase = resultPhaseForView(result, phaseIndex, resultView);
  const summary = buildResultSummaryItems(result, phaseIndex);
  const supportItems = buildSupportReactionListItems(phase);
  const wallLengthSearch = result.search_evaluation;
  const plotData = buildPhasePlotData(result, phaseIndex, resultView);
  const { levels, displacement, rotation, moment, shear, pressure, waterPressure, source } = plotData;
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "  <title>EA Suys Retaining Wall Report</title>",
    "  <style>",
    "    body { font-family: Georgia, \"Times New Roman\", serif; color: #182022; margin: 28px; line-height: 1.5; }",
    "    h1 { margin-bottom: 8px; }",
    "    h2 { margin-top: 22px; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; color: #596265; }",
    "    dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }",
    "    dt { font-weight: 700; color: #596265; }",
    "    dd { margin: 4px 0 0; font-weight: 700; }",
    "    ul { padding-left: 18px; }",
    "    .figure-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 14px; }",
    "    .figure-card { border: 1px solid rgba(24, 32, 34, 0.12); border-radius: 16px; padding: 14px; background: rgba(255, 251, 243, 0.75); break-inside: avoid; }",
    "    .figure-card h3 { margin: 0 0 8px; font-size: 1rem; }",
    "    .figure-card p { margin: 0 0 10px; color: #596265; }",
    "    .figure-card svg { width: 100%; height: auto; display: block; }",
    "    .figure-card-wide { grid-column: 1 / -1; }",
    "    .ec7-verification { border: 1px solid rgba(24, 32, 34, 0.16); border-radius: 12px; padding: 14px; break-inside: avoid; }",
    "    .phase-alert { margin: 10px 0; padding: 10px 12px; border: 1px solid #b42318; border-left-width: 5px; border-radius: 8px; background: #fdecea; color: #5c1411; }",
    "    .phase-alert strong { color: #8a1c14; }",
    "    table { width: 100%; border-collapse: collapse; margin-top: 10px; }",
    "    th, td { border-bottom: 1px solid rgba(24, 32, 34, 0.12); padding: 8px 6px; text-align: left; }",
    "    th { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: #596265; }",
    "    .note { color: #596265; }",
    "    @media (max-width: 900px) { .figure-grid { grid-template-columns: 1fr; } }",
    "  </style>",
    "</head>",
    "<body>",
    "  <h1>EA Suys Retaining Wall Report</h1>",
    `  <p class="note">Generated ${escapeHtml(generatedAt.toISOString())}</p>`,
    "  <h2>Project</h2>",
    `  <dl><div><dt>Wall type</dt><dd>${escapeHtml(displayProject.wall_type.replaceAll("_", " "))}</dd></div><div><dt>Design mode</dt><dd>${escapeHtml(displayProject.design_mode.toUpperCase())}</dd></div><div><dt>Selected phase</dt><dd>${escapeHtml(phase.name)}</dd></div><div><dt>Formula version</dt><dd>${escapeHtml(result.formula_version || "n/a")}</dd></div><div><dt>Wall inclination</dt><dd>${escapeHtml(formatNumber(displayProject.wall_geometry.inclination_degrees ?? 0, 1))}°</dd></div><div><dt>Vertical wall load</dt><dd>${escapeHtml(formatNumber(phase.normalized_vertical_line_load_kN_per_m ?? phase.vertical_line_load_kN_per_m ?? displayProject.phases[phaseIndex]?.vertical_line_load_kN_per_m ?? 0, 1))} kN/m</dd></div><div><dt>Target element length</dt><dd>${escapeHtml(formatNumber(targetElementLengthForProject(displayProject), 2))} m</dd></div><div><dt>Max wall displacement (project limit)</dt><dd>${Number.isFinite(displayProject.design_options?.max_wall_displacement_mm) ? `${escapeHtml(formatNumber(displayProject.design_options?.max_wall_displacement_mm as number, 2))} mm` : "Not declared"}</dd></div><div><dt>${escapeHtml(wallSection.label)}</dt><dd>${escapeHtml(wallSection.value)}</dd></div><div><dt>Toe control</dt><dd>${escapeHtml(wallLengthSearch ? `Search selected ${formatNumber(wallLengthSearch.selected_toe_level_m, 1)} m (${wallLengthSearch.stop_reason})` : `Fixed toe ${formatNumber(displayProject.wall_geometry.toe_level_m, 1)} m`)}</dd></div></dl>`,
    "  <h2>Summary</h2>",
    `  <ul>${summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
    "  <h2>Global Governing Envelope</h2>",
    `  <table><thead><tr><th>Quantity</th><th>Min</th><th>Max</th><th>Max |abs|</th><th>Min phase</th><th>Max phase</th><th>Abs phase</th></tr></thead><tbody>${buildGlobalGoverningRows(result)}</tbody></table>`,
    result?.ec7_verification ? buildEc7VerificationHtml(result) : "",
    wallLengthSearch
      ? `  <h2>Wall-Length Search</h2>\n  <ul><li>Start toe: ${escapeHtml(formatNumber(wallLengthSearch.start_toe_level_m, 1))} m</li><li>Minimum toe: ${escapeHtml(formatNumber(wallLengthSearch.minimum_toe_level_m, 1))} m</li><li>Step: ${escapeHtml(formatNumber(wallLengthSearch.step_m, 2))} m</li><li>Target max head displacement: ${escapeHtml(formatNumber(wallLengthSearch.max_head_displacement_mm, 1))} mm</li><li>Selected toe: ${escapeHtml(formatNumber(wallLengthSearch.selected_toe_level_m, 1))} m</li><li>Achieved max head displacement: ${escapeHtml(formatNumber(wallLengthSearch.achieved_max_head_displacement_mm, 2))} mm</li><li>Stop reason: ${escapeHtml(wallLengthSearch.stop_reason)}</li></ul>`
      : "",
    "  <h2>Discretization</h2>",
    `  <p>${escapeHtml(buildDiscretizationSummary(result))}</p>`,
    `  <table><thead><tr><th>Node</th><th>Level</th><th>Next element</th></tr></thead><tbody>${buildDiscretizationRows(result)}</tbody></table>`,
    "  <h2>Figures</h2>",
    "  <div class=\"figure-grid\">",
    "    <article class=\"figure-card figure-card-wide\">",
    "      <h3>Geometry Preview</h3>",
    "      <p>Selected phase geometry, excavation, groundwater, surface levels, and support layout.</p>",
    buildGeometryPreviewSvg(displayProject, phaseIndex),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Wall Deformed Shape</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "displacement array"))}</p>`,
    buildDeformedWallSvg(levels, displacement),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Displacement Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "displacement array"))}</p>`,
    buildSvgPlot(levels, displacement, "displacement", "Displacement plot", "mm"),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Rotation Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "rotation array"))}</p>`,
    buildSvgPlot(levels, rotation, "rotation", "Rotation plot", "mrad"),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Bending Moment Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "moment array"))}</p>`,
    buildSvgPlot(levels, moment, "moment", "Moment plot", "kNm/m"),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Shear Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "shear array"))}</p>`,
    buildSvgPlot(levels, shear, "shear", "Shear plot", "kN/m"),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Net Pressure Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "net soil pressure array"))}</p>`,
    buildSvgPlot(levels, pressure, "pressure", "Net pressure plot", "kPa"),
    "    </article>",
    "    <article class=\"figure-card\">",
    "      <h3>Water Pressure Plot</h3>",
    `      <p>${escapeHtml(plotSourceDescription(source, "water-pressure array"))}</p>`,
    buildSvgPlot(levels, waterPressure, "water", "Water pressure plot", "kPa"),
    "    </article>",
    "  </div>",
    "  <h2>Wall design check</h2>",
    `  <table><thead><tr><th>Check field</th><th>Value</th></tr></thead><tbody>${buildWallCheckRows(result)}</tbody></table>`,
    "  <h2>Support design checks</h2>",
    `  <ul>${buildSupportCheckList(result)}</ul>`,
    `  <table><thead><tr><th>Support</th><th>Type</th><th>Demand</th><th>Capacity</th><th>Utilization</th><th>Governing phase</th><th>Status</th></tr></thead><tbody>${buildSupportCheckRows(result)}</tbody></table>`,
    "  <h2>Support reactions</h2>",
    `  <ul>${supportItems}</ul>`,
    `  <table><thead><tr><th>Support</th><th>Type</th><th>Side</th><th>Depth</th><th>Horizontal force</th><th>Moment</th><th>Axial force</th><th>Utilization / State</th></tr></thead><tbody>${buildSupportReactionRows(phase)}</tbody></table>`,
    "  <h2>Sampled numerical output</h2>",
    `  <table><thead><tr><th>Level</th><th>Depth</th><th>Disp.</th><th>Rot.</th><th>Moment</th><th>Shear</th><th>Net p</th><th>Water p</th><th>Branch</th><th>Left</th><th>Right</th></tr></thead><tbody>${buildSampledResultRows(phase)}</tbody></table>`,
    "  <h2>Warnings</h2>",
    `  <ul>${readableWarnings(result.warnings).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
    "  <h2>Assumptions</h2>",
    `  <ul>${(result.ec7_verification ? ["See the EC7 verification section for partial factors, design effects and overdig."] : result.assumptions || []).map((item: string) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
    "  <h2>Source refs</h2>",
    `  <ul>${(result.ec7_verification ? [] : result.source_refs || []).map((item: string) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
    "</body>",
    "</html>",
  ].join("\n");
}

function readStoredContactState(): ContactState {
  try {
    const value = JSON.parse(localStorage.getItem(APP_STATE_STORAGE_KEY) || "null");
    if (!value || typeof value !== "object") {
      throw new Error("missing");
    }
    return {
      projectName: typeof value.projectName === "string" ? value.projectName : "",
      email: typeof value.email === "string" ? value.email : "",
      message: typeof value.message === "string" ? value.message : "",
      consent: value.consent === true,
    };
  } catch {
    return {
      projectName: "",
      email: "",
      message: "",
      consent: false,
    };
  }
}

function persistContactState(state: ContactState) {
  localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}

function editorNumberOrNull(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function captureCulmannEditorValues(project: ProjectInput, phaseIndex: number, root: ParentNode) {
  const nextProject = normalizeCulmannProfiles(project);
  const phase = nextProject.phases[phaseIndex];
  if (!phase) return nextProject;
  for (const side of ["left", "right"] as const) {
    const profileDistances = Array.from(root.querySelectorAll<HTMLInputElement>(`[data-cm-profile-distance][data-side="${side}"]`));
    if (profileDistances.length) {
      const profile: CulmannPoint[] = profileDistances
        .sort((a, b) => Number(a.dataset.row) - Number(b.dataset.row))
        .map((distanceInput, rowIndex) => {
          const levelInput = root.querySelector<HTMLInputElement>(`[data-cm-profile-level][data-side="${side}"][data-row="${rowIndex}"]`);
          return rowIndex === 0
            ? [0, soilTopLevel(nextProject, phase, side)]
            : [editorNumberOrNull(distanceInput.value), editorNumberOrNull(levelInput?.value ?? "")];
        });
      phase[`surface_profile_${side}_m`] = profile;
    }

    const stripKey = `strip_surcharges_${side}` as const;
    const strips = phase[stripKey] ?? [];
    phase[stripKey] = strips.map((strip, stripIndex) => {
      const distanceInputs = Array.from(root.querySelectorAll<HTMLInputElement>(`[data-cm-strip-distance][data-side="${side}"][data-strip="${stripIndex}"]`));
      const points: CulmannPoint[] = distanceInputs
        .sort((a, b) => Number(a.dataset.row) - Number(b.dataset.row))
        .map((distanceInput, rowIndex) => {
          const loadInput = root.querySelector<HTMLInputElement>(`[data-cm-strip-load][data-side="${side}"][data-strip="${stripIndex}"][data-row="${rowIndex}"]`);
          return [editorNumberOrNull(distanceInput.value), editorNumberOrNull(loadInput?.value ?? "")];
        });
      const action = root.querySelector<HTMLSelectElement>(`[data-cm-strip-action][data-side="${side}"][data-strip="${stripIndex}"]`)?.value as Ec7ActionType | undefined;
      return { ...strip, points, ...(action ? { action } : {}) };
    });
  }
  return nextProject;
}

export function buildDirectMailto(contact: ContactState, result: any, phaseIndex = 0) {
  const subjectBase = contact.projectName.trim() || "Retaining wall enquiry";
  const summary = buildResultSummaryItems(result, phaseIndex);
  const body = [
    "Retaining tools enquiry",
    "",
    `Project: ${contact.projectName.trim() || "Not provided"}`,
    `Email: ${contact.email.trim() || "Not provided"}`,
    "",
    "Question / context:",
    contact.message.trim() || "Please review this retaining wall result.",
    "",
    "Result summary:",
    ...(summary.length ? summary.map((line) => `- ${line}`) : ["- No result summary captured"]),
  ].join("\n");
  return `mailto:info@easuys.be?subject=${encodeURIComponent(`EA Suys Retaining Tools - ${subjectBase}`)}&body=${encodeURIComponent(body)}`;
}

export function buildContactPanelHtml(
  contactState: ContactState,
  result: any,
  phaseIndex: number,
  statusText = "Ready."
) {
  const fallbackMailto = buildDirectMailto(contactState, result, phaseIndex);
  return [
    `<article class="contact-card-panel">`,
    `<h3>Study request</h3>`,
    `<p>Use the same mailto-first handoff pattern as the structural tools. If the backend Turnstile secret is configured, the API can verify the challenge before preparing the mailto draft.</p>`,
    `<form class="contact-form" data-contact-form>`,
    `<label class="contact-field"><span>Project</span><input data-contact-project type="text" value="${escapeHtml(contactState.projectName)}"></label>`,
    `<label class="contact-field"><span>Email</span><input data-contact-email type="email" value="${escapeHtml(contactState.email)}"></label>`,
    `<label class="contact-field"><span>Message</span><textarea data-contact-message>${escapeHtml(contactState.message)}</textarea></label>`,
    `<label class="contact-consent"><input data-contact-consent type="checkbox" ${contactState.consent ? "checked" : ""}><span>I consent to using this mailto handoff for project follow-up.</span></label>`,
    `<div class="contact-turnstile" data-contact-turnstile></div>`,
    `<div class="contact-actions"><button type="submit" class="action-button">Prepare enquiry</button><a data-contact-fallback href="${escapeHtml(fallbackMailto)}">Open mailto directly</a></div>`,
    `<div class="result-status" data-contact-status>${escapeHtml(statusText)}</div>`,
    `</form>`,
    `</article>`,
  ].join("");
}

export function loadTurnstileScript(
  documentRef = globalThis.document,
  runtimeRef: any = globalThis as any
) {
  if (runtimeRef?.turnstile) {
    return Promise.resolve(runtimeRef.turnstile);
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }
  turnstileScriptPromise = new Promise((resolve, reject) => {
    if (!documentRef) {
      reject(new Error("No document"));
      return;
    }
    const existing = documentRef.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(runtimeRef?.turnstile), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
      return;
    }
    const script = documentRef.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(runtimeRef?.turnstile), { once: true });
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
    documentRef.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

function unavailableServiceMessage(status: number) {
  return `The calculation service is currently unavailable (HTTP ${status}). Your input is kept; you can download the JSON payload and try again later.`;
}

export async function runAnalysis(
  project: ProjectInput,
  fetchImpl: typeof fetch = fetch,
  apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")
) {
  const validationErrors = validateEarthPressureInput(project);
  if (validationErrors.length) {
    throw new Error(`Please fix the earth-pressure inputs before analysis: ${validationErrors.join(" ")}`);
  }
  let response: Response;
  try {
    response = await fetchImpl(`${apiBaseUrl}${ANALYSIS_ROUTE}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(buildAnalysisPayload(project)),
    });
  } catch {
    throw new Error(unavailableServiceMessage(0));
  }

  const status = Number.isFinite(response.status) ? response.status : response.ok ? 200 : 0;
  let body: any;
  try {
    body = await response.json();
  } catch {
    throw new Error(unavailableServiceMessage(status));
  }
  if (status === 404 || status >= 500) {
    throw new Error(unavailableServiceMessage(status));
  }
  if (!response.ok) {
    throw new Error(body?.error || "Request failed.");
  }
  return body;
}

export async function checkCalculationService(
  fetchImpl: typeof fetch = fetch,
  apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetchImpl(`${apiBaseUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    if (!response.ok) {
      return false;
    }
    const body = await response.json();
    return body?.ok === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function buildStudyRequestPayload(
  contactState: ContactState,
  result: any,
  phaseIndex: number,
  turnstileToken = "",
  sourceUrl = globalThis.location?.href || ""
) {
  return {
    email: contactState.email.trim(),
    project_name: contactState.projectName.trim(),
    message: contactState.message.trim(),
    lead_tracking_consent: contactState.consent,
    source_tool: "retaining_flexible_wall_analysis",
    tool_label: "Flexible wall analysis",
    locale: "en",
    source_url: sourceUrl,
    result_summary: buildResultSummaryItems(result, phaseIndex),
    turnstile_token: turnstileToken,
  };
}

export async function submitStudyRequest(
  payload: ReturnType<typeof buildStudyRequestPayload>,
  fetchImpl: typeof fetch = fetch,
  apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")
) {
  const response = await fetchImpl(`${apiBaseUrl}${CONTACT_ENDPOINT}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Unable to prepare the enquiry.");
  }
  return body;
}

function triggerDownload(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function updateInputPreview(project: ProjectInput, preview: HTMLElement, geometry: HTMLElement, phaseIndex: number) {
  preview.innerHTML = buildInputSnapshot(project, phaseIndex).map((card) => `
    <article class="snapshot-card">
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
  geometry.innerHTML = buildGeometryPreviewSvg(project, phaseIndex);
}

function updateWorkspacePhaseSelect(project: ProjectInput, select: HTMLSelectElement, phaseIndex: number) {
  select.innerHTML = buildProjectPhaseOptions(project).map((option) => `
    <option value="${option.index}" ${option.index === phaseIndex ? "selected" : ""}>${escapeHtml(option.label)}</option>
  `).join("");
}

function resultPhaseIndexForProject(project: ProjectInput, result: any, projectPhaseIndex: number) {
  const projectPhase = project.phases[projectPhaseIndex];
  if (!projectPhase || !Array.isArray(result?.phases)) {
    return -1;
  }
  const matchingPhase = result.phases.findIndex((phase: any, index: number) =>
    phase?.name === projectPhase.name || (phase?.phase_index ?? index) === projectPhaseIndex
  );
  return matchingPhase;
}

function renderContactPanel(
  shell: HTMLElement,
  contactState: ContactState,
  result: any,
  phaseIndex: number,
  onPersist: (state: ContactState) => void
) {
  shell.innerHTML = buildContactPanelHtml(contactState, result, phaseIndex);

  const status = shell.querySelector("[data-contact-status]") as HTMLElement;
  const form = shell.querySelector("[data-contact-form]") as HTMLFormElement;
  const projectInput = shell.querySelector("[data-contact-project]") as HTMLInputElement;
  const emailInput = shell.querySelector("[data-contact-email]") as HTMLInputElement;
  const messageInput = shell.querySelector("[data-contact-message]") as HTMLTextAreaElement;
  const consentInput = shell.querySelector("[data-contact-consent]") as HTMLInputElement;
  const fallbackLink = shell.querySelector("[data-contact-fallback]") as HTMLAnchorElement;
  const turnstileTarget = shell.querySelector("[data-contact-turnstile]") as HTMLElement;
  const turnstileState = { token: "" };

  const persist = () => {
    const nextState = {
      projectName: projectInput.value,
      email: emailInput.value,
      message: messageInput.value,
      consent: consentInput.checked,
    };
    onPersist(nextState);
    fallbackLink.href = buildDirectMailto(nextState, result, phaseIndex);
  };

  [projectInput, emailInput, messageInput, consentInput].forEach((field) => {
    field.addEventListener("input", persist);
    field.addEventListener("change", persist);
  });

  loadTurnstileScript(document)
    .then((turnstile) => {
      if (!turnstile || turnstileTarget.dataset.loaded === "true") {
        return;
      }
      turnstileTarget.dataset.loaded = "true";
      turnstile.render(turnstileTarget, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          turnstileState.token = token;
          status.textContent = "Verification ready.";
        },
        "expired-callback": () => {
          turnstileState.token = "";
          status.textContent = "Verification expired. Mailto fallback remains available.";
        },
        "error-callback": () => {
          turnstileState.token = "";
          status.textContent = "Turnstile unavailable. Mailto fallback remains available.";
        },
      });
    })
    .catch(() => {
      status.textContent = "Turnstile unavailable. Mailto fallback remains available.";
    });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    persist();
    status.textContent = "Preparing enquiry...";
    const payload = buildStudyRequestPayload(
      {
        projectName: projectInput.value,
        email: emailInput.value,
        message: messageInput.value,
        consent: consentInput.checked,
      },
      result,
      phaseIndex,
      turnstileState.token
    );
    try {
      const body = await submitStudyRequest(payload);
      status.textContent = "Enquiry prepared. Opening mail client...";
      globalThis.location.href = body.mailto || fallbackLink.href;
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Unable to prepare the enquiry.";
    }
  });
}

function bootApp() {
  const input = document.querySelector("[data-project-input]") as HTMLTextAreaElement | null;
  const quickEditor = document.querySelector("[data-quick-editor]") as HTMLElement | null;
  const runButton = document.querySelector("[data-run-analysis]") as HTMLButtonElement | null;
  const preview = document.querySelector("[data-input-preview]") as HTMLElement | null;
  const geometry = document.querySelector("[data-geometry-preview]") as HTMLElement | null;
  const previewPhase = document.querySelector("[data-preview-phase]") as HTMLSelectElement | null;
  const resultPlots = document.querySelector("[data-result-plots]") as HTMLElement | null;
  const emptyPlots = document.querySelector("[data-empty-plots]") as HTMLElement | null;
  const demoLabel = document.querySelector("[data-demo-label]") as HTMLElement | null;
  const serviceStatus = document.querySelector("[data-service-status]") as HTMLElement | null;
  const downloadInputButton = document.querySelector("[data-download-input]") as HTMLButtonElement | null;
  const resultShell = document.querySelector("[data-result-shell]") as HTMLElement | null;
  const reportShell = document.querySelector("[data-report-shell]") as HTMLElement | null;
  const contactShell = document.querySelector("[data-contact-shell]") as HTMLElement | null;
  const phaseSelect = document.querySelector("[data-phase-select]") as HTMLSelectElement | null;
  const status = document.querySelector("[data-status]") as HTMLElement | null;
  const downloadJsonButton = document.querySelector("[data-download-json]") as HTMLButtonElement | null;
  const downloadHtmlButton = document.querySelector("[data-download-html]") as HTMLButtonElement | null;
  const printButton = document.querySelector("[data-print-report]") as HTMLButtonElement | null;
  if (
    !input ||
    !quickEditor ||
    !runButton ||
    !preview ||
    !geometry ||
    !previewPhase ||
    !resultPlots ||
    !emptyPlots ||
    !demoLabel ||
    !serviceStatus ||
    !downloadInputButton ||
    !resultShell ||
    !reportShell ||
    !contactShell ||
    !phaseSelect ||
    !status ||
    !downloadJsonButton ||
    !downloadHtmlButton ||
    !printButton
  ) {
    return;
  }

  const apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "");
  const demoEnabled = new URLSearchParams(globalThis.location?.search ?? "").get("demo") === "1";
  void checkCalculationService(fetch, apiBaseUrl).then((online) => {
    serviceStatus.textContent = online ? "Service online" : "Service offline";
    serviceStatus.classList.toggle("is-online", online);
    serviceStatus.classList.toggle("is-offline", !online);
  });

  let currentProject = readStoredProject() ?? structuredClone(SAMPLE_PROJECT);
  let currentResult: any = demoEnabled ? structuredClone(DEMO_RESULT ?? SAMPLE_RESULT) : null;
  let currentPreviewPhaseIndex = demoEnabled ? Math.min(2, currentProject.phases.length - 1) : 0;
  let currentResultPhaseIndex = 0;
  let currentResultDesignView: ResultDesignView = "characteristic";
  let currentEditorTabId = "general";
  let currentContactState = readStoredContactState();
  let currentEditorFocus: EditorFocusState = {
    segmentIndex: 0,
    leftLayerIndex: 0,
    rightLayerIndex: 0,
    supportIndex: 0,
  };

  const renderPreview = (rebuildEditor = true) => {
    currentEditorFocus = normalizeEditorFocus(currentProject, currentEditorFocus);
    persistStoredProject(currentProject);
    updateWorkspacePhaseSelect(currentProject, previewPhase, currentPreviewPhaseIndex);
    updateInputPreview(currentProject, preview, geometry, currentPreviewPhaseIndex);
    if (rebuildEditor) {
      quickEditor.innerHTML = buildQuickEditorHtml(currentProject, currentPreviewPhaseIndex, currentEditorFocus);
      const jsonInputMount = quickEditor.querySelector("[data-json-input-mount]");
      if (jsonInputMount) {
        jsonInputMount.append(input);
        input.hidden = false;
      }
      bindQuickEditor();
    }
  };

  const bindQuickEditor = () => {
    const tabs = Array.from(quickEditor.querySelectorAll("[role='tab']")) as HTMLButtonElement[];
    const activateTab = (selectedTab: HTMLButtonElement) => {
      currentEditorTabId = selectedTab.dataset.editorTab ?? "general";
      tabs.forEach((tab) => {
        const active = tab === selectedTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        const panel = quickEditor.querySelector(`#${tab.getAttribute("aria-controls")}`) as HTMLElement | null;
        if (panel) {
          panel.hidden = !active;
        }
      });
    };
    const selectTab = (tab: HTMLButtonElement) => {
      const leavingJson = currentEditorTabId === "json" && tab.dataset.editorTab !== "json";
      currentEditorTabId = tab.dataset.editorTab ?? "general";
      if (leavingJson) {
        currentProject = normalizeCulmannProfiles(currentProject);
        input.value = formatJson(currentProject);
        renderPreview();
        return;
      }
      activateTab(tab);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (event) => {
        const keyEvent = event as KeyboardEvent;
        let nextIndex = index;
        if (keyEvent.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (keyEvent.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (keyEvent.key === "Home") {
          nextIndex = 0;
        } else if (keyEvent.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }
        keyEvent.preventDefault();
        const targetTabId = tabs[nextIndex].dataset.editorTab;
        selectTab(tabs[nextIndex]);
        (quickEditor.querySelector(`[data-editor-tab="${targetTabId}"]`) as HTMLButtonElement | null)?.focus();
      });
    });
    activateTab(tabs.find((tab) => tab.dataset.editorTab === currentEditorTabId) ?? tabs[0]);

    quickEditor.querySelectorAll("[data-qe-structure-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = (button as HTMLButtonElement).dataset.qeStructureAction as StructureAction | undefined;
        if (!action) {
          return;
        }
        const nextState = applyQuickEditorStructureAction(currentProject, currentEditorFocus, action, currentPreviewPhaseIndex);
        currentProject = nextState.project;
        currentEditorFocus = nextState.focus;
        if (typeof nextState.previewPhaseIndex === "number") {
          currentPreviewPhaseIndex = nextState.previewPhaseIndex;
        }
        input.value = formatJson(currentProject);
        renderPreview();
        if (currentResult) {
          status.textContent = "Structured editor changed the payload. Rerun the analysis to refresh results.";
        }
      });
    });
    quickEditor.querySelectorAll<HTMLButtonElement>("[data-qe-culmann-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.qeCulmannAction as Parameters<typeof applyCulmannStructureAction>[2] | undefined;
        const side = button.dataset.side as "left" | "right" | undefined;
        if (!action || !side) return;
        currentProject = captureCulmannEditorValues(currentProject, currentPreviewPhaseIndex, quickEditor);
        currentProject = applyCulmannStructureAction(
          currentProject,
          currentPreviewPhaseIndex,
          action,
          side,
          Number(button.dataset.strip ?? 0),
          Number(button.dataset.row ?? 0)
        );
        input.value = formatJson(currentProject);
        renderPreview();
        if (currentResult) status.textContent = "Culmann inputs updated. Rerun the analysis to refresh results.";
      });
    });
    quickEditor.querySelector("[data-qe-ec7-reset]")?.addEventListener("click", () => {
      currentProject = resetEc7PartialFactors(currentProject);
      input.value = formatJson(currentProject);
      currentEditorTabId = "general";
      renderPreview();
      if (currentResult) {
        status.textContent = "EC7 partial factors reset to defaults. Rerun the analysis to refresh results.";
      }
    });
    quickEditor.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("change", () => {
        if (
          field.matches("[data-qe-segment-index]") ||
          field.matches("[data-qe-left-layer-index]") ||
          field.matches("[data-qe-right-layer-index]") ||
          field.matches("[data-qe-support-index]")
        ) {
          currentEditorFocus = normalizeEditorFocus(currentProject, {
            segmentIndex: Number((quickEditor.querySelector("[data-qe-segment-index]") as HTMLSelectElement | null)?.value ?? 0),
            leftLayerIndex: Number((quickEditor.querySelector("[data-qe-left-layer-index]") as HTMLSelectElement | null)?.value ?? 0),
            rightLayerIndex: Number((quickEditor.querySelector("[data-qe-right-layer-index]") as HTMLSelectElement | null)?.value ?? 0),
            supportIndex: Number((quickEditor.querySelector("[data-qe-support-index]") as HTMLSelectElement | null)?.value ?? 0),
          });
          renderPreview();
          if (currentResult) {
            status.textContent = "Structured editor focus changed. Rerun the analysis after editing to refresh results.";
          }
          return;
        }
        if (field.matches("[data-cm-profile-distance], [data-cm-profile-level], [data-cm-strip-distance], [data-cm-strip-load], [data-cm-strip-action]")) {
          currentProject = captureCulmannEditorValues(currentProject, currentPreviewPhaseIndex, quickEditor);
          input.value = formatJson(currentProject);
          renderPreview();
          if (currentResult) status.textContent = "Culmann inputs updated. Rerun the analysis to refresh results.";
          return;
        }
        const editorPatch = {
          phase_name: (quickEditor.querySelector("[data-qe-phase-name]") as HTMLInputElement | null)?.value,
          wall_type: (quickEditor.querySelector("[data-qe-wall-type]") as HTMLSelectElement | null)?.value,
          design_mode: (quickEditor.querySelector("[data-qe-design-mode]") as HTMLSelectElement | null)?.value,
          earth_pressure_method: (quickEditor.querySelector("[data-qe-earth-pressure-method]") as HTMLSelectElement | null)?.value,
          wall_friction_cap: (quickEditor.querySelector("[data-qe-wall-friction-cap]") as HTMLSelectElement | null)?.value,
          ec7_partial_factors: readEc7FactorInputs(quickEditor),
          toe_mode: (quickEditor.querySelector("[data-qe-toe-mode]") as HTMLSelectElement | null)?.value,
          top_level_m: Number((quickEditor.querySelector("[data-qe-top-level]") as HTMLInputElement | null)?.value),
          toe_level_m: Number((quickEditor.querySelector("[data-qe-toe-level]") as HTMLInputElement | null)?.value),
          search_start_toe_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-search-start]") as HTMLInputElement | null)?.value),
          search_minimum_toe_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-search-minimum]") as HTMLInputElement | null)?.value),
          search_step_m: numberOrUndefined((quickEditor.querySelector("[data-qe-search-step]") as HTMLInputElement | null)?.value),
          search_max_head_displacement_mm: numberOrUndefined((quickEditor.querySelector("[data-qe-search-max-disp]") as HTMLInputElement | null)?.value),
          target_element_length_m: numberOrUndefined((quickEditor.querySelector("[data-qe-target-element-length]") as HTMLInputElement | null)?.value),
          max_wall_displacement_mm: numberOrUndefined((quickEditor.querySelector("[data-qe-max-wall-displacement]") as HTMLInputElement | null)?.value),
          segment_label: (quickEditor.querySelector("[data-qe-segment-label]") as HTMLInputElement | null)?.value,
          segment_top_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-top]") as HTMLInputElement | null)?.value),
          segment_bottom_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-bottom]") as HTMLInputElement | null)?.value),
          inclination_degrees: Number((quickEditor.querySelector("[data-qe-inclination]") as HTMLInputElement | null)?.value),
          segment_ei_kNm2_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-ei]") as HTMLInputElement | null)?.value),
          segment_cracked_ei_kNm2_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-cracked-ei]") as HTMLInputElement | null)?.value),
          segment_cracking_moment_kNm_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-cracking-moment]") as HTMLInputElement | null)?.value),
          segment_moment_resistance_kNm_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-mr]") as HTMLInputElement | null)?.value),
          segment_shear_resistance_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-segment-vr]") as HTMLInputElement | null)?.value),
          library_section_id: (quickEditor.querySelector("[data-qe-library]") as HTMLSelectElement | null)?.value,
          section_name: (quickEditor.querySelector("[data-qe-section-name]") as HTMLInputElement | null)?.value,
          plastic_section_modulus_cm3_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-wpl]") as HTMLInputElement | null)?.value),
          shear_area_cm2_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-av]") as HTMLInputElement | null)?.value),
          steel_grade_mpa: numberOrUndefined((quickEditor.querySelector("[data-qe-fy]") as HTMLInputElement | null)?.value),
          gamma_m0: numberOrUndefined((quickEditor.querySelector("[data-qe-gamma-m0]") as HTMLInputElement | null)?.value),
          surface_level_left_m: numberOrUndefined((quickEditor.querySelector("[data-qe-surface-left]") as HTMLInputElement | null)?.value),
          surface_level_right_m: numberOrUndefined((quickEditor.querySelector("[data-qe-surface-right]") as HTMLInputElement | null)?.value),
          excavation_level_left_m: numberOrUndefined((quickEditor.querySelector("[data-qe-exc-left]") as HTMLInputElement | null)?.value),
          excavation_level_right_m: numberOrUndefined((quickEditor.querySelector("[data-qe-exc-right]") as HTMLInputElement | null)?.value),
          groundwater_level_left_m: numberOrUndefined((quickEditor.querySelector("[data-qe-gw-left]") as HTMLInputElement | null)?.value),
          groundwater_level_right_m: numberOrUndefined((quickEditor.querySelector("[data-qe-gw-right]") as HTMLInputElement | null)?.value),
          surcharge_left_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-sur-left]") as HTMLInputElement | null)?.value),
          surcharge_right_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-sur-right]") as HTMLInputElement | null)?.value),
          surcharge_left_action: (quickEditor.querySelector("[data-qe-surcharge-left-action]") as HTMLSelectElement | null)?.value,
          surcharge_right_action: (quickEditor.querySelector("[data-qe-surcharge-right-action]") as HTMLSelectElement | null)?.value,
          vertical_line_load_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-vertical-load]") as HTMLInputElement | null)?.value),
          vertical_line_load_action: (quickEditor.querySelector("[data-qe-vertical-line-load-action]") as HTMLSelectElement | null)?.value,
          include_vertical_line_second_order:
            ((quickEditor.querySelector("[data-qe-second-order]") as HTMLSelectElement | null)?.value === "true"),
          left_top_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-left-top]") as HTMLInputElement | null)?.value),
          left_bottom_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-left-bottom]") as HTMLInputElement | null)?.value),
          left_unit_weight_dry_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-left-gamma-dry]") as HTMLInputElement | null)?.value),
          left_unit_weight_wet_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-left-gamma-wet]") as HTMLInputElement | null)?.value),
          left_friction_angle_deg: numberOrUndefined((quickEditor.querySelector("[data-qe-left-phi]") as HTMLInputElement | null)?.value),
          left_cohesion_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-left-cohesion]") as HTMLInputElement | null)?.value),
          left_wall_friction_deg: numberOrUndefined((quickEditor.querySelector("[data-qe-left-wall-friction]") as HTMLInputElement | null)?.value),
          left_at_rest_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-left-k0]") as HTMLInputElement | null)?.value),
          left_active_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-left-ka]") as HTMLInputElement | null)?.value),
          left_passive_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-left-kp]") as HTMLInputElement | null)?.value),
          left_bedding_model: (quickEditor.querySelector("[data-qe-left-bedding-model]") as HTMLSelectElement | null)?.value,
          left_tri_linear_displacement_breakpoints_mm:
            numberOrUndefined((quickEditor.querySelector("[data-qe-left-breakpoint-1]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-left-breakpoint-2]") as HTMLInputElement | null)?.value) !== undefined
              ? [
                  numberOrUndefined((quickEditor.querySelector("[data-qe-left-breakpoint-1]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-left-breakpoint-2]") as HTMLInputElement | null)?.value),
                ]
              : undefined,
          left_tri_linear_stiffness_factors:
            numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-1]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-2]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-3]") as HTMLInputElement | null)?.value) !== undefined
              ? [
                  numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-1]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-2]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-left-factor-3]") as HTMLInputElement | null)?.value),
                ]
              : undefined,
          left_subgrade_modulus_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-left-ks]") as HTMLInputElement | null)?.value),
          left_pore_pressure_offset_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-left-pore]") as HTMLInputElement | null)?.value),
          right_top_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-right-top]") as HTMLInputElement | null)?.value),
          right_bottom_level_m: numberOrUndefined((quickEditor.querySelector("[data-qe-right-bottom]") as HTMLInputElement | null)?.value),
          right_unit_weight_dry_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-right-gamma-dry]") as HTMLInputElement | null)?.value),
          right_unit_weight_wet_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-right-gamma-wet]") as HTMLInputElement | null)?.value),
          right_friction_angle_deg: numberOrUndefined((quickEditor.querySelector("[data-qe-right-phi]") as HTMLInputElement | null)?.value),
          right_cohesion_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-right-cohesion]") as HTMLInputElement | null)?.value),
          right_wall_friction_deg: numberOrUndefined((quickEditor.querySelector("[data-qe-right-wall-friction]") as HTMLInputElement | null)?.value),
          right_at_rest_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-right-k0]") as HTMLInputElement | null)?.value),
          right_active_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-right-ka]") as HTMLInputElement | null)?.value),
          right_passive_coefficient: numberOrUndefined((quickEditor.querySelector("[data-qe-right-kp]") as HTMLInputElement | null)?.value),
          right_bedding_model: (quickEditor.querySelector("[data-qe-right-bedding-model]") as HTMLSelectElement | null)?.value,
          right_tri_linear_displacement_breakpoints_mm:
            numberOrUndefined((quickEditor.querySelector("[data-qe-right-breakpoint-1]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-right-breakpoint-2]") as HTMLInputElement | null)?.value) !== undefined
              ? [
                  numberOrUndefined((quickEditor.querySelector("[data-qe-right-breakpoint-1]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-right-breakpoint-2]") as HTMLInputElement | null)?.value),
                ]
              : undefined,
          right_tri_linear_stiffness_factors:
            numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-1]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-2]") as HTMLInputElement | null)?.value) !== undefined &&
            numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-3]") as HTMLInputElement | null)?.value) !== undefined
              ? [
                  numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-1]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-2]") as HTMLInputElement | null)?.value),
                  numberOrUndefined((quickEditor.querySelector("[data-qe-right-factor-3]") as HTMLInputElement | null)?.value),
                ]
              : undefined,
          right_subgrade_modulus_kN_m3: numberOrUndefined((quickEditor.querySelector("[data-qe-right-ks]") as HTMLInputElement | null)?.value),
          right_pore_pressure_offset_kPa: numberOrUndefined((quickEditor.querySelector("[data-qe-right-pore]") as HTMLInputElement | null)?.value),
          support_id: (quickEditor.querySelector("[data-qe-support-id]") as HTMLInputElement | null)?.value,
          support_type: (quickEditor.querySelector("[data-qe-support-type]") as HTMLSelectElement | null)?.value,
          support_side: (quickEditor.querySelector("[data-qe-support-side]") as HTMLSelectElement | null)?.value,
          support_depth_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-depth]") as HTMLInputElement | null)?.value),
          support_active_from_phase: numberOrUndefined((quickEditor.querySelector("[data-qe-support-active-from]") as HTMLInputElement | null)?.value),
          support_active_to_phase: ((quickEditor.querySelector("[data-qe-support-active-to]") as HTMLInputElement | null)?.value === "")
            ? null
            : numberOrUndefined((quickEditor.querySelector("[data-qe-support-active-to]") as HTMLInputElement | null)?.value),
          support_inclination_degrees: numberOrUndefined((quickEditor.querySelector("[data-qe-support-inclination]") as HTMLInputElement | null)?.value),
          support_stiffness_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-stiffness]") as HTMLInputElement | null)?.value),
          support_prestress_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-prestress]") as HTMLInputElement | null)?.value),
          support_capacity_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-capacity]") as HTMLInputElement | null)?.value),
          support_force_kN_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-force]") as HTMLInputElement | null)?.value),
          support_moment_kNm_per_m: numberOrUndefined((quickEditor.querySelector("[data-qe-support-moment]") as HTMLInputElement | null)?.value),
          support_action_type: (quickEditor.querySelector("[data-qe-support-action-type]") as HTMLSelectElement | null)?.value,
          anchor_inclination_degrees: numberOrUndefined((quickEditor.querySelector("[data-qe-anchor-inclination]") as HTMLInputElement | null)?.value),
        };
        const changedField = field.matches("[data-qe-top-level]")
          ? "top_level_m"
          : field.matches("[data-qe-toe-level]")
            ? "toe_level_m"
            : field.matches("[data-qe-segment-top]")
              ? "segment_top_level_m"
              : field.matches("[data-qe-segment-bottom]")
                ? "segment_bottom_level_m"
                : field.matches("[data-qe-design-mode]")
                  ? "design_mode"
                  : "";
        currentProject = applyQuickEditorPatch(
          currentProject,
          currentPreviewPhaseIndex,
          reconcileQuickEditorEventPatch(changedField, editorPatch),
          currentEditorFocus
        );
        input.value = formatJson(currentProject);
        renderPreview();
        if (currentResult) {
          status.textContent = "Quick editor updated the payload. Rerun the analysis to refresh results.";
        }
      });
    });
  };

  const renderResults = () => {
    demoLabel.hidden = !demoEnabled;
    downloadJsonButton.disabled = !currentResult;
    downloadHtmlButton.disabled = !currentResult;
    printButton.disabled = !currentResult;
    if (!currentResult) {
      resultShell.innerHTML = "";
      resultPlots.innerHTML = "";
      emptyPlots.hidden = false;
      reportShell.innerHTML = `<article class="report-card"><h3>Exports</h3><p>Run the analysis to enable JSON download, HTML report export, and the inline study request flow.</p></article>`;
      contactShell.innerHTML = "";
      return;
    }
    currentResultPhaseIndex = resultPhaseIndexForProject(currentProject, currentResult, currentPreviewPhaseIndex);
    updateWorkspacePhaseSelect(currentProject, phaseSelect, currentPreviewPhaseIndex);
    if (currentResultPhaseIndex < 0) {
      resultShell.innerHTML = `<article class="result-card"><h3>No matching result phase</h3><p>The selected input phase is not present in this result. Choose a phase that was included in the calculation.</p></article>`;
      resultPlots.innerHTML = "";
      emptyPlots.hidden = false;
      reportShell.innerHTML = "";
      contactShell.innerHTML = "";
      return;
    }
    resultShell.innerHTML = buildResultHtml(currentResult, currentResultPhaseIndex, currentResultDesignView);
    const resultViewToolbar = resultShell.querySelector(".result-view-toolbar");
    const plotGrid = resultShell.querySelector(".depth-plot-grid");
    resultPlots.innerHTML = `${resultViewToolbar?.outerHTML ?? ""}${plotGrid?.outerHTML ?? ""}`;
    resultViewToolbar?.remove();
    plotGrid?.remove();
    emptyPlots.hidden = Boolean(plotGrid);
    resultPlots.querySelector<HTMLSelectElement>("[data-result-design-view]")?.addEventListener("change", (event) => {
      const selected = (event.currentTarget as HTMLSelectElement).value;
      currentResultDesignView = selected === "set1" || selected === "set2" ? selected : "characteristic";
      renderResults();
    });
    reportShell.innerHTML = buildReportPreviewHtml(currentProject, currentResult, currentResultPhaseIndex);
    renderContactPanel(contactShell, currentContactState, currentResult, currentResultPhaseIndex, (nextState) => {
      currentContactState = nextState;
      persistContactState(currentContactState);
    });
  };

  input.value = formatJson(currentProject);
  renderPreview();
  renderResults();
  if (demoEnabled) {
    status.textContent = "Demo result — not a calculation.";
  }

  input.addEventListener("input", () => {
    try {
      currentProject = normalizeCulmannProfiles(JSON.parse(input.value));
      currentPreviewPhaseIndex = Math.min(currentPreviewPhaseIndex, Math.max(0, currentProject.phases.length - 1));
      currentEditorFocus = normalizeEditorFocus(currentProject, currentEditorFocus);
      renderPreview(false);
      status.textContent = currentResult
        ? "Payload parsed. Rerun the analysis to refresh results."
        : "Payload parsed. Ready to run.";
      status.classList.remove("status-error");
    } catch {
      status.textContent = "Payload JSON is invalid.";
      status.classList.add("status-error");
    }
  });

  phaseSelect.addEventListener("change", () => {
    currentPreviewPhaseIndex = Number(phaseSelect.value);
    currentResultPhaseIndex = currentResult
      ? resultPhaseIndexForProject(currentProject, currentResult, currentPreviewPhaseIndex)
      : 0;
    currentEditorFocus = normalizeEditorFocus(currentProject, currentEditorFocus);
    renderPreview();
    renderResults();
  });

  runButton.addEventListener("click", async () => {
    try {
      status.textContent = "Running phased analysis...";
      status.classList.remove("status-error");
      currentProject = JSON.parse(input.value);
      currentResult = await runAnalysis(currentProject, fetch, apiBaseUrl);
      currentResultDesignView = "characteristic";
      currentPreviewPhaseIndex = governingPhaseIndex(currentResult, currentProject.phases.length);
      currentResultPhaseIndex = resultPhaseIndexForProject(currentProject, currentResult, currentPreviewPhaseIndex);
      renderPreview();
      renderResults();
      status.textContent = `Solved ${currentResult.phases.length} phase(s). Governing |M|max: ${formatNumber(currentResult.governing.max_abs_moment_kNm_per_m, 2)} kNm/m.`;
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Analysis failed.";
      status.classList.add("status-error");
    }
  });

  downloadInputButton.addEventListener("click", () => {
    triggerDownload(
      buildResultFilename(currentProject).replace(/\.json$/, "-input.json"),
      input.value,
      "application/json"
    );
  });

  downloadJsonButton.addEventListener("click", () => {
    if (!currentResult) {
      return;
    }
    const analyzedProject = resolveAnalyzedProject(currentProject, currentResult);
    triggerDownload(
      buildResultFilename(analyzedProject),
      buildResultDownloadText(currentProject, currentResult),
      "application/json"
    );
  });

  downloadHtmlButton.addEventListener("click", () => {
    if (!currentResult) {
      return;
    }
    const analyzedProject = resolveAnalyzedProject(currentProject, currentResult);
    triggerDownload(
      buildReportFilename(analyzedProject),
      buildReportHtml(currentProject, currentResult, currentResultPhaseIndex, new Date(), currentResultDesignView),
      "text/html;charset=utf-8"
    );
  });

  printButton.addEventListener("click", () => {
    if (!currentResult) {
      return;
    }
    const reportHtml = buildReportHtml(currentProject, currentResult, currentResultPhaseIndex, new Date(), currentResultDesignView);
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      status.textContent = "Unable to open a print window.";
      status.classList.add("status-error");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  });
}

if (typeof document !== "undefined") {
  bootApp();
}
