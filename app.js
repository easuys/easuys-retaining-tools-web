export const API_BASE_URL = "https://easuys-retaining-tools-api.yellow-violet-f185.workers.dev";
const ALLOWED_API_ORIGINS = new Set([
    "https://easuys-retaining-tools-api.yellow-violet-f185.workers.dev",
    "https://easuys-retaining-tools-api-staging.yellow-violet-f185.workers.dev",
    "http://127.0.0.1:8787",
    "http://localhost:8787",
]);
export function resolveApiBaseUrl(search) {
    const override = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("api");
    if (!override) {
        return API_BASE_URL;
    }
    try {
        const parsed = new URL(override);
        return !parsed.username && !parsed.password && ALLOWED_API_ORIGINS.has(parsed.origin)
            ? parsed.origin
            : API_BASE_URL;
    }
    catch {
        return API_BASE_URL;
    }
}
export const ANALYSIS_ROUTE = "/calculate/retaining/flexible-wall-analysis";
export const CONTACT_ENDPOINT = "/lead/study-request";
export const TURNSTILE_SITE_KEY = "0x4AAAAAADYeVJCZgqihubKs";
export const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const APP_STATE_STORAGE_KEY = "ea-suys-retaining-contact";
// Built-in sheet-pile sections, the same rows as the API catalogue
// (easuys-retaining-tools-api src/sheet_pile_catalogue.ts). Source: ArcelorMittal
// Sheet Piling products database, metric tables, accessed 2026-10-18:
//   AZ:                 https://sheetpiling.arcelormittal.com/products/az-sections/az
//   AZ-700 and AZ-770:  https://sheetpiling.arcelormittal.com/products/az-sections/az-700-and-az-770
// Wall mass to 0.1 kg/m2 from the flyer Z&U-01.2026-GB, page 1. Every row is
// tied to its transcribed source row by tests/sheet_pile_catalogue.test.mjs
// (tests/fixtures/sheet_pile_catalogue_sources.json).
// "AZ 18" is the 630 mm AZ 18 (h 380 mm, I 34 200 cm4/m), not the AZ 18-700.
// Av per EN 1993-5:2007 5.2.2(4): Av = tw (h - tf) per web, one web per
// single-pile width b, so Av [cm2/m] = tw (h - tf) / b * 10 (mm in, cm2/m out).
// EI [kNm2/m] = 210 000 MPa * I [cm4/m] * 1e-5.
export const SHEET_PILE_STEEL_E_MPA = 210_000;
// id, name, b mm, h mm, tf mm, tw mm, A cm2/m, single-pile kg/m, wall kg/m2, I cm4/m, Wel cm3/m, Wpl cm3/m
const SHEET_PILE_ROWS = [
    ["AZ_18", "AZ 18", 630, 380, 9.5, 9.5, 150, 74.4, 118.1, 34200, 1800, 2104],
    ["AZ_18_10_10", "AZ 18-10/10", 630, 381, 10.0, 10.0, 157, 77.8, 123.4, 35540, 1870, 2189],
    ["AZ_26", "AZ 26", 630, 427, 13.0, 12.2, 198, 97.8, 155.2, 55510, 2600, 3059],
    ["AZ_12_700", "AZ 12-700", 700, 314, 8.5, 8.5, 123, 67.7, 96.7, 18880, 1205, 1415],
    ["AZ_13_700", "AZ 13-700", 700, 315, 9.5, 9.5, 135, 74.0, 105.7, 20540, 1305, 1540],
    ["AZ_13_700_10_10", "AZ 13-700-10/10", 700, 316, 10.0, 10.0, 140, 77.2, 110.2, 21370, 1355, 1600],
    ["AZ_14_700", "AZ 14-700", 700, 316, 10.5, 10.5, 146, 80.3, 114.7, 22190, 1405, 1665],
    ["AZ_17_700", "AZ 17-700", 700, 420, 8.5, 8.5, 133, 73.1, 104.4, 36230, 1730, 2027],
    ["AZ_18_700", "AZ 18-700", 700, 420, 9.0, 9.0, 139, 76.5, 109.3, 37800, 1800, 2116],
    ["AZ_19_700", "AZ 19-700", 700, 421, 9.5, 9.5, 146, 80.0, 114.3, 39380, 1870, 2206],
    ["AZ_20_700", "AZ 20-700", 700, 421, 10.0, 10.0, 152, 83.5, 119.3, 40960, 1945, 2296],
    ["AZ_24_700", "AZ 24-700", 700, 459, 11.2, 11.2, 174, 95.7, 136.7, 55820, 2430, 2867],
    ["AZ_26_700", "AZ 26-700", 700, 460, 12.2, 12.2, 187, 102.9, 146.9, 59720, 2600, 3070],
    ["AZ_28_700", "AZ 28-700", 700, 461, 13.2, 13.2, 200, 110.0, 157.2, 63620, 2760, 3273],
    ["AZ_36_700N", "AZ 36-700N", 700, 499, 15.0, 11.2, 216, 118.6, 169.5, 89610, 3590, 4110],
    ["AZ_38_700N", "AZ 38-700N", 700, 500, 16.0, 12.2, 230, 126.4, 180.6, 94840, 3795, 4360],
    ["AZ_40_700N", "AZ 40-700N", 700, 501, 17.0, 13.2, 244, 134.2, 191.7, 100080, 3995, 4605],
    ["AZ_42_700N", "AZ 42-700N", 700, 499, 18.0, 14.0, 259, 142.1, 203.1, 104930, 4205, 4855],
    ["AZ_44_700N", "AZ 44-700N", 700, 500, 19.0, 15.0, 273, 149.9, 214.2, 110150, 4405, 5105],
    ["AZ_46_700N", "AZ 46-700N", 700, 501, 20.0, 16.0, 287, 157.7, 225.3, 115370, 4605, 5350],
    ["AZ_48_700", "AZ 48-700", 700, 503, 22.0, 15.0, 288, 158.5, 226.4, 119650, 4755, 5490],
    ["AZ_50_700", "AZ 50-700", 700, 504, 23.0, 16.0, 303, 166.3, 237.5, 124890, 4955, 5735],
    ["AZ_52_700", "AZ 52-700", 700, 505, 24.0, 17.0, 317, 174.1, 248.7, 130140, 5155, 5985],
    ["AZ_12_770", "AZ 12-770", 770, 344, 8.5, 8.5, 120, 72.6, 94.3, 21430, 1245, 1480],
    ["AZ_13_770", "AZ 13-770", 770, 344, 9.0, 9.0, 126, 76.1, 98.8, 22360, 1300, 1546],
    ["AZ_14_770", "AZ 14-770", 770, 345, 9.5, 9.5, 132, 79.5, 103.2, 23300, 1355, 1611],
    ["AZ_14_770_10_10", "AZ 14-770-10/10", 770, 345, 10.0, 10.0, 137, 82.9, 107.7, 24240, 1405, 1677],
];
export const STEEL_SHEET_PILE_LIBRARY = Object.freeze(Object.fromEntries(SHEET_PILE_ROWS.map(([id, name, b, h, tf, tw, area, massPile, massWall, inertia, wel, wpl]) => [
    id,
    Object.freeze({
        // The 630 mm series has no width suffix; say so, so "AZ 18" is never read as AZ 18-700.
        label: b === 630 ? `${name} (630 mm series)` : name,
        section_name: name,
        width_mm: b,
        height_mm: h,
        flange_thickness_mm: tf,
        web_thickness_mm: tw,
        sectional_area_cm2_per_m: area,
        mass_single_pile_kg_per_m: massPile,
        mass_wall_kg_per_m2: massWall,
        moment_of_inertia_cm4_per_m: inertia,
        elastic_section_modulus_cm3_per_m: wel,
        plastic_section_modulus_cm3_per_m: wpl,
        shear_area_cm2_per_m: (tw * (h - tf)) / b * 10,
        ei_kNm2_per_m: SHEET_PILE_STEEL_E_MPA * inertia * 1e-5,
    }),
])));
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
};
export const SAMPLE_PROJECT = {
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
                // E I of the catalogue AZ 18 (630 mm): 210 000 MPa x 34 200 cm4/m = 71 820 kNm2/m.
                ei_kNm2_per_m: 71820,
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
const sheetPileSegment = (libraryId, topLevelM, bottomLevelM) => ({
    label: STEEL_SHEET_PILE_LIBRARY[libraryId].section_name,
    top_level_m: topLevelM,
    bottom_level_m: bottomLevelM,
    ei_kNm2_per_m: Math.round(STEEL_SHEET_PILE_LIBRARY[libraryId].ei_kNm2_per_m),
    steel_section: { library_section_id: libraryId, steel_grade_mpa: 355 },
});
const sameLayersBothSides = (layers) => ({
    left: { layers: structuredClone(layers) },
    right: { layers: structuredClone(layers) },
});
// One-click examples. Public API features only: horizontal ground, uniform
// surcharges, the Coulomb earth-pressure default, EC7-BE design approach 1 with
// the default partial factors. Left = excavation side, right = retained side.
// Soil values are typical illustrative values for Belgian soils, not project data.
export const EXAMPLE_PRESETS = [
    {
        id: "cantilever-sand",
        title: "Cantilever sheet pile in sand",
        lede: "3.0 m excavation in medium dense sand, no anchors.",
        facts: [
            "AZ 18-700, S355, toe at −9.0 m",
            "Loose sand fill over medium dense sand (φ′ 30–32.5°)",
            "Groundwater −4.0 m · 10 kPa site traffic",
            "Displacement limit 30 mm (H/100)",
        ],
        note: "Typical of a temporary pit or a basement edge in Campine or Flemish sand.",
        project: {
            design_mode: "ec7",
            wall_type: "steel_sheet_pile",
            wall_geometry: {
                top_level_m: 0,
                toe_level_m: -9,
                inclination_degrees: 0,
                segments: [sheetPileSegment("AZ_18_700", 0, -9)],
            },
            phases: [
                {
                    name: "Initial state",
                    excavation_level_left_m: 0,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -4,
                    groundwater_level_right_m: -4,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -3.0 m",
                    excavation_level_left_m: -3,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -4,
                    groundwater_level_right_m: -4,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
            ],
            soil_profiles: sameLayersBothSides([
                { top_level_m: 0, bottom_level_m: -1, unit_weight_dry_kN_m3: 17, unit_weight_wet_kN_m3: 19, friction_angle_deg: 30, cohesion_kPa: 0, subgrade_modulus_kN_m3: 12000 },
                { top_level_m: -1, bottom_level_m: -15, unit_weight_dry_kN_m3: 18, unit_weight_wet_kN_m3: 20, friction_angle_deg: 32.5, cohesion_kPa: 0, subgrade_modulus_kN_m3: 20000 },
            ]),
            supports: [],
            design_options: { target_element_length_m: 0.25, max_wall_displacement_mm: 30 },
        },
    },
    {
        id: "anchored-sheet-pile",
        title: "Anchored sheet pile, one anchor row",
        lede: "6.0 m basement pit next to a street, grouted anchors at −1.5 m.",
        facts: [
            "AZ 26-700, S355, toe at −13.0 m",
            "Fill, loam, then dense sand (φ′ 27.5–32.5°)",
            "Groundwater −3.0 m outside, pumped to −6.5 m inside",
            "Anchors at 30°, prestress 100 kN/m · limit 30 mm",
        ],
        note: "Excavate to −2.0 m, install and prestress the anchors, then excavate to the final level.",
        project: {
            design_mode: "ec7",
            wall_type: "steel_sheet_pile",
            wall_geometry: {
                top_level_m: 0,
                toe_level_m: -13,
                inclination_degrees: 0,
                segments: [sheetPileSegment("AZ_26_700", 0, -13)],
            },
            phases: [
                {
                    name: "Initial state",
                    excavation_level_left_m: 0,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -3,
                    groundwater_level_right_m: -3,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -2.0 m",
                    excavation_level_left_m: -2,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -3,
                    groundwater_level_right_m: -3,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Install and prestress anchors",
                    excavation_level_left_m: -2,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -3,
                    groundwater_level_right_m: -3,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -6.0 m (pumped to -6.5 m)",
                    excavation_level_left_m: -6,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -6.5,
                    groundwater_level_right_m: -3,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
            ],
            soil_profiles: sameLayersBothSides([
                { top_level_m: 0, bottom_level_m: -2, unit_weight_dry_kN_m3: 17, unit_weight_wet_kN_m3: 19, friction_angle_deg: 30, cohesion_kPa: 0, subgrade_modulus_kN_m3: 12000 },
                { top_level_m: -2, bottom_level_m: -5, unit_weight_dry_kN_m3: 18, unit_weight_wet_kN_m3: 19, friction_angle_deg: 27.5, cohesion_kPa: 2, subgrade_modulus_kN_m3: 8000 },
                { top_level_m: -5, bottom_level_m: -20, unit_weight_dry_kN_m3: 18, unit_weight_wet_kN_m3: 20, friction_angle_deg: 32.5, cohesion_kPa: 0, subgrade_modulus_kN_m3: 30000 },
            ]),
            supports: [
                {
                    id: "A1",
                    type: "anchor",
                    depth_m: 1.5,
                    side: "right",
                    inclination_degrees: 30,
                    stiffness_kN_per_m: 8000,
                    prestress_kN_per_m: 100,
                    capacity_kN_per_m: 400,
                    active_from_phase: 2,
                },
            ],
            design_options: { target_element_length_m: 0.25, max_wall_displacement_mm: 30 },
        },
    },
    {
        id: "propped-diaphragm-wall",
        title: "Propped diaphragm wall",
        lede: "7.0 m two-level basement, 0.60 m diaphragm wall, two rows of steel props.",
        facts: [
            "0.60 m C30/37 wall, toe at −15.0 m in clay",
            "Fill, dense sand, stiff clay from −12 m (φ′ 22.5–32.5°)",
            "Groundwater −5.0 m outside, pumped to −7.5 m inside",
            "Props at −1.0 m and −4.0 m · limit 25 mm",
        ],
        note: "Typical Brussels profile: fill over Brussels sand on Ieper clay. Moment and shear resistance are the entered design values of the reinforced section.",
        project: {
            design_mode: "ec7",
            wall_type: "diaphragm_wall",
            wall_geometry: {
                top_level_m: 0,
                toe_level_m: -15,
                inclination_degrees: 0,
                segments: [
                    {
                        label: "Diaphragm wall 0.60 m C30/37",
                        top_level_m: 0,
                        bottom_level_m: -15,
                        // E_cm 33 000 MPa x 0.60^3 / 12 m4/m.
                        ei_kNm2_per_m: 594000,
                        moment_resistance_kNm_per_m: 420,
                        shear_resistance_kN_per_m: 230,
                    },
                ],
            },
            phases: [
                {
                    name: "Initial state",
                    excavation_level_left_m: 0,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -2.0 m",
                    excavation_level_left_m: -2,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Install props at -1.0 m",
                    excavation_level_left_m: -2,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -4.5 m",
                    excavation_level_left_m: -4.5,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Install props at -4.0 m",
                    excavation_level_left_m: -4.5,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
                {
                    name: "Excavate to -7.0 m (pumped to -7.5 m)",
                    excavation_level_left_m: -7,
                    excavation_level_right_m: 0,
                    groundwater_level_left_m: -7.5,
                    groundwater_level_right_m: -5,
                    surcharge_left_kPa: 0,
                    surcharge_right_kPa: 10,
                },
            ],
            soil_profiles: sameLayersBothSides([
                { top_level_m: 0, bottom_level_m: -3, unit_weight_dry_kN_m3: 18, unit_weight_wet_kN_m3: 19, friction_angle_deg: 27.5, cohesion_kPa: 0, subgrade_modulus_kN_m3: 8000 },
                { top_level_m: -3, bottom_level_m: -12, unit_weight_dry_kN_m3: 18, unit_weight_wet_kN_m3: 20, friction_angle_deg: 32.5, cohesion_kPa: 0, subgrade_modulus_kN_m3: 30000 },
                { top_level_m: -12, bottom_level_m: -25, unit_weight_dry_kN_m3: 19.5, unit_weight_wet_kN_m3: 19.5, friction_angle_deg: 22.5, cohesion_kPa: 10, subgrade_modulus_kN_m3: 15000 },
            ]),
            supports: [
                {
                    id: "P1",
                    type: "strut",
                    depth_m: 1,
                    // side = direction of the support force on the wall: the props push it towards the retained soil.
                    side: "right",
                    inclination_degrees: 0,
                    stiffness_kN_per_m: 40000,
                    prestress_kN_per_m: 50,
                    capacity_kN_per_m: 600,
                    active_from_phase: 2,
                },
                {
                    id: "P2",
                    type: "strut",
                    depth_m: 4,
                    side: "right",
                    inclination_degrees: 0,
                    stiffness_kN_per_m: 40000,
                    prestress_kN_per_m: 100,
                    capacity_kN_per_m: 600,
                    active_from_phase: 4,
                },
            ],
            design_options: { target_element_length_m: 0.25, max_wall_displacement_mm: 25 },
        },
    },
];
export function examplePresetById(id) {
    return EXAMPLE_PRESETS.find((preset) => preset.id === id);
}
export const SAMPLE_RESULT = {
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
            // Capacities of the catalogue AZ 18 (630 mm), fy 355 MPa, gamma_M0 1.0:
            // 2104 cm3/m x 355 = 746.92 kNm/m; 55.869 cm2/m x 355 / sqrt(3) = 1145.088 kN/m.
            bending_utilization: 0.244,
            bending_demand_kNm_per_m: 182.5,
            bending_capacity_kNm_per_m: 746.92,
            bending_governing_phase: "Deepen excavation to -5.0 m",
            bending_governing_level_m: -4,
            shear_utilization: 0.089,
            shear_demand_kN_per_m: 102.3,
            shear_capacity_kN_per_m: 1145.088,
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
        "Illustrative values for frontend rendering tests; not a calculation",
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
// BEGIN GENERATED DEMO_RESULT (scripts/build_demo_result.mjs, engine formula ea-suys-retaining-formulas-2026-10-18-a)
export const DEMO_RESULT = { "calculator_id": "retaining_flexible_wall_analysis", "version": "0.1.0", "formula_version": "ea-suys-retaining-formulas-2026-10-18-a", "earth_pressure_method": "coulomb", "wall_friction_cap": "phi_over_3", "normalized_input": { "design_mode": "classic", "wall_type": "steel_sheet_pile", "wall_geometry": { "top_level_m": 0, "toe_level_m": -9, "inclination_degrees": 4, "segments": [{ "label": "AZ 18 sample", "top_level_m": 0, "bottom_level_m": -9, "ei_kNm2_per_m": 71820, "steel_section": { "library_section_id": "AZ_18", "steel_grade_mpa": 355, "gamma_m0": 1 } }] }, "phases": [{ "name": "Initial at-rest state", "excavation_level_left_m": 0, "excavation_level_right_m": 0, "groundwater_level_left_m": -2, "groundwater_level_right_m": -2, "surcharge_left_kPa": 0, "surcharge_right_kPa": 12 }, { "name": "Excavate left side to -4.0 m", "excavation_level_left_m": -4, "excavation_level_right_m": 0, "groundwater_level_left_m": -2, "groundwater_level_right_m": -2, "surcharge_left_kPa": 0, "surcharge_right_kPa": 18, "vertical_line_load_kN_per_m": 35, "include_vertical_line_second_order": true }, { "name": "Deepen excavation to -5.0 m", "excavation_level_left_m": -5, "excavation_level_right_m": 0, "groundwater_level_left_m": -2, "groundwater_level_right_m": -2, "surcharge_left_kPa": 0, "surcharge_right_kPa": 18, "vertical_line_load_kN_per_m": 35, "include_vertical_line_second_order": true }], "soil_profiles": { "left": { "layers": [{ "top_level_m": 0, "bottom_level_m": -12, "unit_weight_dry_kN_m3": 17, "unit_weight_wet_kN_m3": 20, "friction_angle_deg": 30, "cohesion_kPa": 0, "subgrade_modulus_kN_m3": 22000 }] }, "right": { "layers": [{ "top_level_m": 0, "bottom_level_m": -12, "unit_weight_dry_kN_m3": 18, "unit_weight_wet_kN_m3": 20, "friction_angle_deg": 33, "cohesion_kPa": 0, "subgrade_modulus_kN_m3": 28000 }] } }, "supports": [{ "id": "A1", "type": "anchor", "depth_m": 1.6, "side": "right", "inclination_degrees": 15, "stiffness_kN_per_m": 9000, "prestress_kN_per_m": 55, "capacity_kN_per_m": 150, "active_from_phase": 1 }], "design_options": { "target_element_length_m": 0.5, "max_wall_displacement_mm": 30 } }, "discretization": { "node_levels_m": [0, -0.5, -1, -1.5, -1.6, -2, -2.5, -3, -3.5, -4, -4.5, -5, -5.5, -6, -6.5, -7, -7.5, -8, -8.5, -9], "element_lengths_m": [0.5, 0.5, 0.5, 0.1, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }, "phases": [{ "name": "Initial at-rest state", "phase_index": 0, "converged": true, "iterations": 3, "sampled_results": [{ "level_m": 0, "depth_m": 0, "displacement_mm": -0.147573, "rotation_mrad": 0.0298917, "moment_kNm_per_m": -4.44089e-14, "shear_kN_per_m": 1.47723e-10, "shear_above_kN_per_m": 0, "shear_below_kN_per_m": 1.47723e-10, "net_soil_pressure_kPa": -3.53715, "left_soil_pressure_kPa": 0.00051, "right_soil_pressure_kPa": 3.53766, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -0.5, "depth_m": 0.5, "displacement_mm": -0.132883, "rotation_mrad": 0.0283564, "moment_kNm_per_m": -0.441067, "shear_kN_per_m": -0.637089, "shear_above_kN_per_m": -0.637089, "shear_below_kN_per_m": -0.637089, "net_soil_pressure_kPa": 0.982641, "left_soil_pressure_kPa": 7.17351, "right_soil_pressure_kPa": 6.19087, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -1, "depth_m": 1, "displacement_mm": -0.119586, "rotation_mrad": 0.0246034, "moment_kNm_per_m": -0.637081, "shear_kN_per_m": -0.187905, "shear_above_kN_per_m": -0.187905, "shear_below_kN_per_m": -0.187905, "net_soil_pressure_kPa": 0.818487, "left_soil_pressure_kPa": 11.131, "right_soil_pressure_kPa": 10.3125, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -1.5, "depth_m": 1.5, "displacement_mm": -0.108389, "rotation_mrad": 0.0201964, "moment_kNm_per_m": -0.628971, "shear_kN_per_m": 0.118557, "shear_above_kN_per_m": 0.118557, "shear_below_kN_per_m": 0.118557, "net_soil_pressure_kPa": 0.410359, "left_soil_pressure_kPa": 15.1346, "right_soil_pressure_kPa": 14.7243, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -1.6, "depth_m": 1.6, "displacement_mm": -0.106413, "rotation_mrad": 0.0193303, "moment_kNm_per_m": -0.615069, "shear_kN_per_m": 0.156078, "shear_above_kN_per_m": 0.156078, "shear_below_kN_per_m": 0.156078, "net_soil_pressure_kPa": 0.341901, "left_soil_pressure_kPa": 15.9412, "right_soil_pressure_kPa": 15.5993, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -2, "depth_m": 2, "displacement_mm": -0.0993322, "rotation_mrad": 0.0161545, "moment_kNm_per_m": -0.525352, "shear_kN_per_m": 0.246094, "shear_above_kN_per_m": 0.246094, "shear_below_kN_per_m": 0.246094, "net_soil_pressure_kPa": 0.109288, "left_soil_pressure_kPa": 19.1854, "right_soil_pressure_kPa": 19.0761, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -2.5, "depth_m": 2.5, "displacement_mm": -0.09209, "rotation_mrad": 0.0129728, "moment_kNm_per_m": -0.388677, "shear_kN_per_m": 0.267017, "shear_above_kN_per_m": 0.267017, "shear_below_kN_per_m": 0.267017, "net_soil_pressure_kPa": -0.0253857, "left_soil_pressure_kPa": 21.5735, "right_soil_pressure_kPa": 21.5989, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -3, "depth_m": 3, "displacement_mm": -0.0862044, "rotation_mrad": 0.0107206, "moment_kNm_per_m": -0.258335, "shear_kN_per_m": 0.237683, "shear_above_kN_per_m": 0.237683, "shear_below_kN_per_m": 0.237683, "net_soil_pressure_kPa": -0.092228, "left_soil_pressure_kPa": 23.9915, "right_soil_pressure_kPa": 24.0838, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -3.5, "depth_m": 3.5, "displacement_mm": -0.0812315, "rotation_mrad": 0.00929581, "moment_kNm_per_m": -0.150994, "shear_kN_per_m": 0.186388, "shear_above_kN_per_m": 0.186388, "shear_below_kN_per_m": 0.186388, "net_soil_pressure_kPa": -0.113441, "left_soil_pressure_kPa": 26.4296, "right_soil_pressure_kPa": 26.5431, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -4, "depth_m": 4, "displacement_mm": -0.0768005, "rotation_mrad": 0.00851977, "moment_kNm_per_m": -0.0719451, "shear_kN_per_m": 0.131272, "shear_above_kN_per_m": 0.131272, "shear_below_kN_per_m": 0.131272, "net_soil_pressure_kPa": -0.107553, "left_soil_pressure_kPa": 28.8797, "right_soil_pressure_kPa": 28.9872, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -4.5, "depth_m": 4.5, "displacement_mm": -0.0726355, "rotation_mrad": 0.00820069, "moment_kNm_per_m": -0.0197205, "shear_kN_per_m": 0.0824093, "shear_above_kN_per_m": 0.0824093, "shear_below_kN_per_m": 0.0824093, "net_soil_pressure_kPa": -0.0883657, "left_soil_pressure_kPa": 31.3355, "right_soil_pressure_kPa": 31.4239, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -5, "depth_m": 5, "displacement_mm": -0.068552, "rotation_mrad": 0.00816847, "moment_kNm_per_m": 0.0104653, "shear_kN_per_m": 0.0441325, "shear_above_kN_per_m": 0.0441325, "shear_below_kN_per_m": 0.0441325, "net_soil_pressure_kPa": -0.0651066, "left_soil_pressure_kPa": 33.7932, "right_soil_pressure_kPa": 33.8583, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -5.5, "depth_m": 5.5, "displacement_mm": -0.0644415, "rotation_mrad": 0.00828988, "moment_kNm_per_m": 0.0244131, "shear_kN_per_m": 0.01712, "shear_above_kN_per_m": 0.01712, "shear_below_kN_per_m": 0.01712, "net_soil_pressure_kPa": -0.0431979, "left_soil_pressure_kPa": 36.2503, "right_soil_pressure_kPa": 36.2935, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -6, "depth_m": 6, "displacement_mm": -0.0602522, "rotation_mrad": 0.00847089, "moment_kNm_per_m": 0.0275865, "shear_kN_per_m": 0.0000535243, "shear_above_kN_per_m": 0.0000535243, "shear_below_kN_per_m": 0.0000535243, "net_soil_pressure_kPa": -0.0252257, "left_soil_pressure_kPa": 38.7056, "right_soil_pressure_kPa": 38.7308, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -6.5, "depth_m": 6.5, "displacement_mm": -0.0559705, "rotation_mrad": 0.00865209, "moment_kNm_per_m": 0.0244677, "shear_kN_per_m": -0.00920063, "shear_above_kN_per_m": -0.00920063, "shear_below_kN_per_m": -0.00920063, "net_soil_pressure_kPa": -0.0118722, "left_soil_pressure_kPa": 41.1589, "right_soil_pressure_kPa": 41.1708, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -7, "depth_m": 7, "displacement_mm": -0.0516054, "rotation_mrad": 0.00880126, "moment_kNm_per_m": 0.018387, "shear_kN_per_m": -0.0128349, "shear_above_kN_per_m": -0.0128349, "shear_below_kN_per_m": -0.0128349, "net_soil_pressure_kPa": -0.0026914, "left_soil_pressure_kPa": 43.6104, "right_soil_pressure_kPa": 43.6131, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -7.5, "depth_m": 7.5, "displacement_mm": -0.0471767, "rotation_mrad": 0.00890576, "moment_kNm_per_m": 0.0116339, "shear_kN_per_m": -0.0126832, "shear_above_kN_per_m": -0.0126832, "shear_below_kN_per_m": -0.0126832, "net_soil_pressure_kPa": 0.00330875, "left_soil_pressure_kPa": 46.0604, "right_soil_pressure_kPa": 46.0571, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -8, "depth_m": 8, "displacement_mm": -0.042707, "rotation_mrad": 0.00896612, "moment_kNm_per_m": 0.00570488, "shear_kN_per_m": -0.0100497, "shear_above_kN_per_m": -0.0100497, "shear_below_kN_per_m": -0.0100497, "net_soil_pressure_kPa": 0.00726016, "left_soil_pressure_kPa": 48.5096, "right_soil_pressure_kPa": 48.5023, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -8.5, "depth_m": 8.5, "displacement_mm": -0.0382164, "rotation_mrad": 0.00899149, "moment_kNm_per_m": 0.00158533, "shear_kN_per_m": -0.00570602, "shear_above_kN_per_m": -0.00570602, "shear_below_kN_per_m": -0.00570602, "net_soil_pressure_kPa": 0.0101662, "left_soil_pressure_kPa": 50.9583, "right_soil_pressure_kPa": 50.9481, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -9, "depth_m": 9, "displacement_mm": -0.0337188, "rotation_mrad": 0.00899701, "moment_kNm_per_m": 8.88178e-16, "shear_kN_per_m": -3.36952e-11, "shear_above_kN_per_m": -3.36952e-11, "shear_below_kN_per_m": 0, "net_soil_pressure_kPa": 0.0127136, "left_soil_pressure_kPa": 53.4068, "right_soil_pressure_kPa": 53.394, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }], "support_reactions": [{ "id": "A1", "type": "anchor", "side": "right", "depth_m": 1.6, "reaction_kN_per_m": 0, "branch_state": "inactive" }], "envelope": { "max_abs_displacement_mm": 0.147573, "max_abs_moment_kNm_per_m": 0.637081, "max_abs_shear_kN_per_m": 0.637089, "max_abs_plastic_offset_mm": 0 } }, { "name": "Excavate left side to -4.0 m", "phase_index": 1, "converged": true, "iterations": 4, "sampled_results": [{ "level_m": 0, "depth_m": 0, "displacement_mm": 0.0508454, "rotation_mrad": -0.42456, "moment_kNm_per_m": 0, "shear_kN_per_m": -5.08065e-11, "shear_above_kN_per_m": 0, "shear_below_kN_per_m": -5.08065e-11, "net_soil_pressure_kPa": -11.8255, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 11.8255, "water_pressure_kPa": 0, "branch_state": "inactive/neutral", "left_branch": "inactive", "right_branch": "neutral" }, { "level_m": -0.5, "depth_m": 0.5, "displacement_mm": -0.162286, "rotation_mrad": -0.429667, "moment_kNm_per_m": -1.46713, "shear_kN_per_m": -4.96917, "shear_above_kN_per_m": -4.96917, "shear_below_kN_per_m": -4.96917, "net_soil_pressure_kPa": -8.09976, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 8.09976, "water_pressure_kPa": 0, "branch_state": "inactive/neutral", "left_branch": "inactive", "right_branch": "neutral" }, { "level_m": -1, "depth_m": 1, "displacement_mm": -0.381696, "rotation_mrad": -0.452019, "moment_kNm_per_m": -4.95404, "shear_kN_per_m": -9.6359, "shear_above_kN_per_m": -9.6359, "shear_below_kN_per_m": -9.6359, "net_soil_pressure_kPa": -10.6129, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 10.6129, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -1.5, "depth_m": 1.5, "displacement_mm": -0.619886, "rotation_mrad": -0.507857, "moment_kNm_per_m": -11.087, "shear_kN_per_m": -15.5911, "shear_above_kN_per_m": -15.5911, "shear_below_kN_per_m": -15.5911, "net_soil_pressure_kPa": -13.2661, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 13.2661, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -1.6, "depth_m": 1.6, "displacement_mm": -0.671481, "rotation_mrad": -0.524425, "moment_kNm_per_m": -12.7105, "shear_kN_per_m": 36.185, "shear_above_kN_per_m": -16.9409, "shear_below_kN_per_m": 36.185, "net_soil_pressure_kPa": -13.7967, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 13.7967, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -2, "depth_m": 2, "displacement_mm": -0.890441, "rotation_mrad": -0.557954, "moment_kNm_per_m": 0.670109, "shear_kN_per_m": 30.2563, "shear_above_kN_per_m": 30.2563, "shear_below_kN_per_m": 30.2563, "net_soil_pressure_kPa": -15.9193, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 15.9193, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -2.5, "depth_m": 2.5, "displacement_mm": -1.16062, "rotation_mrad": -0.507506, "moment_kNm_per_m": 13.8226, "shear_kN_per_m": 21.9415, "shear_above_kN_per_m": 21.9415, "shear_below_kN_per_m": 21.9415, "net_soil_pressure_kPa": -17.4213, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 17.4213, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -3, "depth_m": 3, "displacement_mm": -1.38521, "rotation_mrad": -0.380619, "moment_kNm_per_m": 22.6289, "shear_kN_per_m": 12.8775, "shear_above_kN_per_m": 12.8775, "shear_below_kN_per_m": 12.8775, "net_soil_pressure_kPa": -18.9233, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 18.9233, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -3.5, "depth_m": 3.5, "displacement_mm": -1.53376, "rotation_mrad": -0.208862, "moment_kNm_per_m": 26.7132, "shear_kN_per_m": 3.0643, "shear_above_kN_per_m": 3.0643, "shear_below_kN_per_m": 3.0643, "net_soil_pressure_kPa": -20.4253, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 20.4253, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -4, "depth_m": 4, "displacement_mm": -1.59229, "rotation_mrad": -0.026412, "moment_kNm_per_m": 25.7004, "shear_kN_per_m": -7.49805, "shear_above_kN_per_m": -7.49805, "shear_below_kN_per_m": -7.49805, "net_soil_pressure_kPa": -21.927, "left_soil_pressure_kPa": 0.0003057, "right_soil_pressure_kPa": 21.9273, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -4.5, "depth_m": 4.5, "displacement_mm": -1.56452, "rotation_mrad": 0.129941, "moment_kNm_per_m": 19.2162, "shear_kN_per_m": -14.9976, "shear_above_kN_per_m": -14.9976, "shear_below_kN_per_m": -14.9976, "net_soil_pressure_kPa": -8.14403, "left_soil_pressure_kPa": 15.2853, "right_soil_pressure_kPa": 23.4293, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -5, "depth_m": 5, "displacement_mm": -1.47105, "rotation_mrad": 0.234073, "moment_kNm_per_m": 10.6986, "shear_kN_per_m": -15.6225, "shear_above_kN_per_m": -15.6225, "shear_below_kN_per_m": -15.6225, "net_soil_pressure_kPa": 5.63896, "left_soil_pressure_kPa": 30.5703, "right_soil_pressure_kPa": 24.9313, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -5.5, "depth_m": 5.5, "displacement_mm": -1.33952, "rotation_mrad": 0.283797, "moment_kNm_per_m": 3.5859, "shear_kN_per_m": -11.5531, "shear_above_kN_per_m": -11.5531, "shear_below_kN_per_m": -11.5531, "net_soil_pressure_kPa": 10.6786, "left_soil_pressure_kPa": 37.112, "right_soil_pressure_kPa": 26.4334, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -6, "depth_m": 6, "displacement_mm": -1.19396, "rotation_mrad": 0.293271, "moment_kNm_per_m": -0.864156, "shear_kN_per_m": -6.76467, "shear_above_kN_per_m": -6.76467, "shear_below_kN_per_m": -6.76467, "net_soil_pressure_kPa": 8.52182, "left_soil_pressure_kPa": 36.4572, "right_soil_pressure_kPa": 27.9354, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -6.5, "depth_m": 6.5, "displacement_mm": -1.05018, "rotation_mrad": 0.279163, "moment_kNm_per_m": -3.18889, "shear_kN_per_m": -3.0423, "shear_above_kN_per_m": -3.0423, "shear_below_kN_per_m": -3.0423, "net_soil_pressure_kPa": 6.40408, "left_soil_pressure_kPa": 35.8415, "right_soil_pressure_kPa": 29.4374, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -7, "depth_m": 7, "displacement_mm": -0.916568, "rotation_mrad": 0.254431, "moment_kNm_per_m": -3.91616, "shear_kN_per_m": -0.320394, "shear_above_kN_per_m": -0.320394, "shear_below_kN_per_m": -0.320394, "net_soil_pressure_kPa": 4.51016, "left_soil_pressure_kPa": 35.4495, "right_soil_pressure_kPa": 30.9394, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -7.5, "depth_m": 7.5, "displacement_mm": -0.795938, "rotation_mrad": 0.228552, "moment_kNm_per_m": -3.51818, "shear_kN_per_m": 1.52807, "shear_above_kN_per_m": 1.52807, "shear_below_kN_per_m": 1.52807, "net_soil_pressure_kPa": 2.90179, "left_soil_pressure_kPa": 35.3432, "right_soil_pressure_kPa": 32.4414, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -8, "depth_m": 8, "displacement_mm": -0.687134, "rotation_mrad": 0.207965, "moment_kNm_per_m": -2.39611, "shear_kN_per_m": 2.63919, "shear_above_kN_per_m": 2.63919, "shear_below_kN_per_m": 2.63919, "net_soil_pressure_kPa": 1.5536, "left_soil_pressure_kPa": 35.497, "right_soil_pressure_kPa": 33.9434, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -8.5, "depth_m": 8.5, "displacement_mm": -0.586446, "rotation_mrad": 0.196539, "moment_kNm_per_m": -0.886314, "shear_kN_per_m": 2.40304, "shear_above_kN_per_m": 2.40304, "shear_below_kN_per_m": 2.40304, "net_soil_pressure_kPa": -2.50051, "left_soil_pressure_kPa": 35.8294, "right_soil_pressure_kPa": 38.3299, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }, { "level_m": -9, "depth_m": 9, "displacement_mm": -0.489205, "rotation_mrad": 0.193453, "moment_kNm_per_m": -1.42109e-13, "shear_kN_per_m": -4.89467e-10, "shear_above_kN_per_m": -4.89467e-10, "shear_below_kN_per_m": 0, "net_soil_pressure_kPa": -7.13512, "left_soil_pressure_kPa": 36.2375, "right_soil_pressure_kPa": 43.3726, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }], "support_reactions": [{ "id": "A1", "type": "anchor", "side": "right", "depth_m": 1.6, "reaction_kN_per_m": 53.126, "axial_force_kN_per_m": 55, "utilization_ratio": 0.367, "branch_state": "elastic" }], "envelope": { "max_abs_displacement_mm": 1.59229, "max_abs_moment_kNm_per_m": 26.7132, "max_abs_shear_kN_per_m": 36.185, "max_abs_plastic_offset_mm": 0.147573 } }, { "name": "Deepen excavation to -5.0 m", "phase_index": 2, "converged": true, "iterations": 3, "sampled_results": [{ "level_m": 0, "depth_m": 0, "displacement_mm": -0.0597069, "rotation_mrad": -1.18617, "moment_kNm_per_m": 2.27374e-13, "shear_kN_per_m": 6.00728e-11, "shear_above_kN_per_m": 0, "shear_below_kN_per_m": 6.00728e-11, "net_soil_pressure_kPa": -8.73008, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 8.73008, "water_pressure_kPa": 0, "branch_state": "inactive/neutral", "left_branch": "inactive", "right_branch": "neutral" }, { "level_m": -0.5, "depth_m": 0.5, "displacement_mm": -0.65341, "rotation_mrad": -1.18988, "moment_kNm_per_m": -1.06782, "shear_kN_per_m": -4.16225, "shear_above_kN_per_m": -4.16225, "shear_below_kN_per_m": -4.16225, "net_soil_pressure_kPa": -7.95968, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 7.95968, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -1, "depth_m": 1, "displacement_mm": -1.25198, "rotation_mrad": -1.20795, "moment_kNm_per_m": -4.12053, "shear_kN_per_m": -8.79405, "shear_above_kN_per_m": -8.79405, "shear_below_kN_per_m": -8.79405, "net_soil_pressure_kPa": -10.6129, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 10.6129, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -1.5, "depth_m": 1.5, "displacement_mm": -1.86643, "rotation_mrad": -1.25647, "moment_kNm_per_m": -9.81943, "shear_kN_per_m": -14.7492, "shear_above_kN_per_m": -14.7492, "shear_below_kN_per_m": -14.7492, "net_soil_pressure_kPa": -13.2661, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 13.2661, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -1.6, "depth_m": 1.6, "displacement_mm": -1.9928, "rotation_mrad": -1.27121, "moment_kNm_per_m": -11.3561, "shear_kN_per_m": 48.1222, "shear_above_kN_per_m": -16.0991, "shear_below_kN_per_m": 48.1222, "net_soil_pressure_kPa": -13.7967, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 13.7967, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -2, "depth_m": 2, "displacement_mm": -2.50719, "rotation_mrad": -1.28387, "moment_kNm_per_m": 6.80973, "shear_kN_per_m": 42.1935, "shear_above_kN_per_m": 42.1935, "shear_below_kN_per_m": 42.1935, "net_soil_pressure_kPa": -15.9193, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 15.9193, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -2.5, "depth_m": 2.5, "displacement_mm": -3.12617, "rotation_mrad": -1.16986, "moment_kNm_per_m": 25.9431, "shear_kN_per_m": 33.8787, "shear_above_kN_per_m": 33.8787, "shear_below_kN_per_m": 33.8787, "net_soil_pressure_kPa": -17.4213, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 17.4213, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -3, "depth_m": 3, "displacement_mm": -3.65737, "rotation_mrad": -0.93778, "moment_kNm_per_m": 40.7286, "shear_kN_per_m": 24.8147, "shear_above_kN_per_m": 24.8147, "shear_below_kN_per_m": 24.8147, "net_soil_pressure_kPa": -18.9233, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 18.9233, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -3.5, "depth_m": 3.5, "displacement_mm": -4.04954, "rotation_mrad": -0.619207, "moment_kNm_per_m": 50.79, "shear_kN_per_m": 15.0015, "shear_above_kN_per_m": 15.0015, "shear_below_kN_per_m": 15.0015, "net_soil_pressure_kPa": -20.4253, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 20.4253, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -4, "depth_m": 4, "displacement_mm": -4.26786, "rotation_mrad": -0.24834, "moment_kNm_per_m": 55.7515, "shear_kN_per_m": 4.43914, "shear_above_kN_per_m": 4.43914, "shear_below_kN_per_m": 4.43914, "net_soil_pressure_kPa": -21.9273, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 21.9273, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -4.5, "depth_m": 4.5, "displacement_mm": -4.2953, "rotation_mrad": 0.138009, "moment_kNm_per_m": 55.2378, "shear_kN_per_m": -6.87239, "shear_above_kN_per_m": -6.87239, "shear_below_kN_per_m": -6.87239, "net_soil_pressure_kPa": -23.4293, "left_soil_pressure_kPa": 0, "right_soil_pressure_kPa": 23.4293, "water_pressure_kPa": 0, "branch_state": "inactive/active", "left_branch": "inactive", "right_branch": "active" }, { "level_m": -5, "depth_m": 5, "displacement_mm": -4.13384, "rotation_mrad": 0.500419, "moment_kNm_per_m": 48.8744, "shear_kN_per_m": -18.9331, "shear_above_kN_per_m": -18.9331, "shear_below_kN_per_m": -18.9331, "net_soil_pressure_kPa": -24.931, "left_soil_pressure_kPa": 0.0003057, "right_soil_pressure_kPa": 24.9313, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -5.5, "depth_m": 5.5, "displacement_mm": -3.80587, "rotation_mrad": 0.796865, "moment_kNm_per_m": 36.2876, "shear_kN_per_m": -27.931, "shear_above_kN_per_m": -27.931, "shear_below_kN_per_m": -27.931, "net_soil_pressure_kPa": -11.148, "left_soil_pressure_kPa": 15.2853, "right_soil_pressure_kPa": 26.4334, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -6, "depth_m": 6, "displacement_mm": -3.3532, "rotation_mrad": 0.995988, "moment_kNm_per_m": 20.9161, "shear_kN_per_m": -30.0543, "shear_above_kN_per_m": -30.0543, "shear_below_kN_per_m": -30.0543, "net_soil_pressure_kPa": 2.63494, "left_soil_pressure_kPa": 30.5703, "right_soil_pressure_kPa": 27.9354, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -6.5, "depth_m": 6.5, "displacement_mm": -2.82734, "rotation_mrad": 1.09038, "moment_kNm_per_m": 6.19914, "shear_kN_per_m": -25.3028, "shear_above_kN_per_m": -25.3028, "shear_below_kN_per_m": -25.3028, "net_soil_pressure_kPa": 16.4179, "left_soil_pressure_kPa": 45.8553, "right_soil_pressure_kPa": 29.4374, "water_pressure_kPa": 0, "branch_state": "passive/active", "left_branch": "passive", "right_branch": "active" }, { "level_m": -7, "depth_m": 7, "displacement_mm": -2.27752, "rotation_mrad": 1.09655, "moment_kNm_per_m": -4.42425, "shear_kN_per_m": -13.8871, "shear_above_kN_per_m": -13.8871, "shear_below_kN_per_m": -13.8871, "net_soil_pressure_kPa": 29.3562, "left_soil_pressure_kPa": 60.2956, "right_soil_pressure_kPa": 30.9394, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -7.5, "depth_m": 7.5, "displacement_mm": -1.73886, "rotation_mrad": 1.05426, "moment_kNm_per_m": -7.72608, "shear_kN_per_m": -1.93947, "shear_above_kN_per_m": -1.93947, "shear_below_kN_per_m": -1.93947, "net_soil_pressure_kPa": 18.5512, "left_soil_pressure_kPa": 50.9926, "right_soil_pressure_kPa": 32.4414, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -8, "depth_m": 8, "displacement_mm": -1.22441, "rotation_mrad": 1.00508, "moment_kNm_per_m": -6.40057, "shear_kN_per_m": 4.75165, "shear_above_kN_per_m": 4.75165, "shear_below_kN_per_m": 4.75165, "net_soil_pressure_kPa": 8.27872, "left_soil_pressure_kPa": 42.2221, "right_soil_pressure_kPa": 33.9434, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -8.5, "depth_m": 8.5, "displacement_mm": -0.731043, "rotation_mrad": 0.972328, "moment_kNm_per_m": -3.0097, "shear_kN_per_m": 6.43473, "shear_above_kN_per_m": 6.43473, "shear_below_kN_per_m": 6.43473, "net_soil_pressure_kPa": -1.52992, "left_soil_pressure_kPa": 33.9155, "right_soil_pressure_kPa": 35.4454, "water_pressure_kPa": 0, "branch_state": "neutral/active", "left_branch": "neutral", "right_branch": "active" }, { "level_m": -9, "depth_m": 9, "displacement_mm": -0.248371, "rotation_mrad": 0.961851, "moment_kNm_per_m": 0, "shear_kN_per_m": -2.48714e-10, "shear_above_kN_per_m": -2.48714e-10, "shear_below_kN_per_m": 0, "net_soil_pressure_kPa": -24.2718, "left_soil_pressure_kPa": 25.8441, "right_soil_pressure_kPa": 50.116, "water_pressure_kPa": 0, "branch_state": "neutral/neutral", "left_branch": "neutral", "right_branch": "neutral" }], "support_reactions": [{ "id": "A1", "type": "anchor", "side": "right", "depth_m": 1.6, "reaction_kN_per_m": 64.221, "axial_force_kN_per_m": 66.486, "utilization_ratio": 0.443, "branch_state": "elastic" }], "envelope": { "max_abs_displacement_mm": 4.2953, "max_abs_moment_kNm_per_m": 55.7515, "max_abs_shear_kN_per_m": 48.1222, "max_abs_plastic_offset_mm": 1.59229 } }], "governing": { "max_abs_displacement_mm": 4.295, "max_abs_displacement_phase": "Deepen excavation to -5.0 m", "max_displacement_mm": 0.051, "max_displacement_phase": "Excavate left side to -4.0 m", "min_displacement_mm": -4.295, "min_displacement_phase": "Deepen excavation to -5.0 m", "max_abs_rotation_mrad": 1.284, "max_abs_rotation_phase": "Deepen excavation to -5.0 m", "max_rotation_mrad": 1.097, "max_rotation_phase": "Deepen excavation to -5.0 m", "min_rotation_mrad": -1.284, "min_rotation_phase": "Deepen excavation to -5.0 m", "max_abs_moment_kNm_per_m": 55.751, "max_abs_moment_phase": "Deepen excavation to -5.0 m", "max_moment_kNm_per_m": 55.751, "max_moment_phase": "Deepen excavation to -5.0 m", "min_moment_kNm_per_m": -12.711, "min_moment_phase": "Excavate left side to -4.0 m", "max_abs_shear_kN_per_m": 48.122, "max_abs_shear_phase": "Deepen excavation to -5.0 m", "max_shear_kN_per_m": 48.122, "max_shear_phase": "Deepen excavation to -5.0 m", "min_shear_kN_per_m": -30.054, "min_shear_phase": "Deepen excavation to -5.0 m" }, "design_checks": { "wall": { "wall_type": "steel_sheet_pile", "governing_check": "bending", "governing_phase": "Deepen excavation to -5.0 m", "governing_level_m": -4, "bending_governing_phase": "Deepen excavation to -5.0 m", "bending_governing_level_m": -4, "bending_demand_kNm_per_m": 55.751, "bending_capacity_kNm_per_m": 746.92, "bending_utilization": 0.075, "shear_governing_phase": "Deepen excavation to -5.0 m", "shear_governing_level_m": -1.6, "shear_demand_kN_per_m": 48.122, "shear_capacity_kN_per_m": 1145.09, "shear_utilization": 0.042, "cracked_stiffness_state": "not_applicable", "pass": true }, "supports": [{ "support_id": "A1", "support_type": "anchor", "governing_phase": "Deepen excavation to -5.0 m", "demand_kN_per_m": 64.221, "capacity_kN_per_m": 144.889, "axial_demand_kN_per_m": 66.486, "axial_capacity_kN_per_m": 150, "utilization_ratio": 0.443, "pass": true }], "serviceability": { "assessed": true, "max_abs_displacement_mm": 4.295, "limit_mm": 30, "pass": true }, "overall_pass": true }, "visualization": { "phases": [{ "name": "Initial at-rest state", "phase_index": 0, "converged": true, "iterations": 3, "levels_m": [0, -0.5, -1, -1.5, -1.6, -2, -2.5, -3, -3.5, -4, -4.5, -5, -5.5, -6, -6.5, -7, -7.5, -8, -8.5, -9], "displacement_mm": [-0.147573, -0.132883, -0.119586, -0.108389, -0.106413, -0.0993322, -0.09209, -0.0862044, -0.0812315, -0.0768005, -0.0726355, -0.068552, -0.0644415, -0.0602522, -0.0559705, -0.0516054, -0.0471767, -0.042707, -0.0382164, -0.0337188], "rotation_mrad": [0.0298917, 0.0283564, 0.0246034, 0.0201964, 0.0193303, 0.0161545, 0.0129728, 0.0107206, 0.00929581, 0.00851977, 0.00820069, 0.00816847, 0.00828988, 0.00847089, 0.00865209, 0.00880126, 0.00890576, 0.00896612, 0.00899149, 0.00899701], "moment_kNm_per_m": [-4.44089e-14, -0.441067, -0.637081, -0.628971, -0.615069, -0.525352, -0.388677, -0.258335, -0.150994, -0.0719451, -0.0197205, 0.0104653, 0.0244131, 0.0275865, 0.0244677, 0.018387, 0.0116339, 0.00570488, 0.00158533, 8.88178e-16], "shear_kN_per_m": [1.47723e-10, -0.637089, -0.187905, 0.118557, 0.156078, 0.246094, 0.267017, 0.237683, 0.186388, 0.131272, 0.0824093, 0.0441325, 0.01712, 0.0000535243, -0.00920063, -0.0128349, -0.0126832, -0.0100497, -0.00570602, -3.36952e-11], "shear_above_kN_per_m": [0, -0.637089, -0.187905, 0.118557, 0.156078, 0.246094, 0.267017, 0.237683, 0.186388, 0.131272, 0.0824093, 0.0441325, 0.01712, 0.0000535243, -0.00920063, -0.0128349, -0.0126832, -0.0100497, -0.00570602, -3.36952e-11], "shear_below_kN_per_m": [1.47723e-10, -0.637089, -0.187905, 0.118557, 0.156078, 0.246094, 0.267017, 0.237683, 0.186388, 0.131272, 0.0824093, 0.0441325, 0.01712, 0.0000535243, -0.00920063, -0.0128349, -0.0126832, -0.0100497, -0.00570602, 0], "net_soil_pressure_kPa": [-3.53715, 0.982641, 0.818487, 0.410359, 0.341901, 0.109288, -0.0253857, -0.092228, -0.113441, -0.107553, -0.0883657, -0.0651066, -0.0431979, -0.0252257, -0.0118722, -0.0026914, 0.00330875, 0.00726016, 0.0101662, 0.0127136], "left_soil_pressure_kPa": [0.00051, 7.17351, 11.131, 15.1346, 15.9412, 19.1854, 21.5735, 23.9915, 26.4296, 28.8797, 31.3355, 33.7932, 36.2503, 38.7056, 41.1589, 43.6104, 46.0604, 48.5096, 50.9583, 53.4068], "right_soil_pressure_kPa": [3.53766, 6.19087, 10.3125, 14.7243, 15.5993, 19.0761, 21.5989, 24.0838, 26.5431, 28.9872, 31.4239, 33.8583, 36.2935, 38.7308, 41.1708, 43.6131, 46.0571, 48.5023, 50.9481, 53.394], "water_pressure_kPa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "branch_state": ["passive/active", "neutral/active", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral", "neutral/neutral"], "left_branch": ["passive", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"], "right_branch": ["active", "active", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"] }, { "name": "Excavate left side to -4.0 m", "phase_index": 1, "converged": true, "iterations": 4, "levels_m": [0, -0.5, -1, -1.5, -1.6, -2, -2.5, -3, -3.5, -4, -4.5, -5, -5.5, -6, -6.5, -7, -7.5, -8, -8.5, -9], "displacement_mm": [0.0508454, -0.162286, -0.381696, -0.619886, -0.671481, -0.890441, -1.16062, -1.38521, -1.53376, -1.59229, -1.56452, -1.47105, -1.33952, -1.19396, -1.05018, -0.916568, -0.795938, -0.687134, -0.586446, -0.489205], "rotation_mrad": [-0.42456, -0.429667, -0.452019, -0.507857, -0.524425, -0.557954, -0.507506, -0.380619, -0.208862, -0.026412, 0.129941, 0.234073, 0.283797, 0.293271, 0.279163, 0.254431, 0.228552, 0.207965, 0.196539, 0.193453], "moment_kNm_per_m": [0, -1.46713, -4.95404, -11.087, -12.7105, 0.670109, 13.8226, 22.6289, 26.7132, 25.7004, 19.2162, 10.6986, 3.5859, -0.864156, -3.18889, -3.91616, -3.51818, -2.39611, -0.886314, -1.42109e-13], "shear_kN_per_m": [-5.08065e-11, -4.96917, -9.6359, -15.5911, 36.185, 30.2563, 21.9415, 12.8775, 3.0643, -7.49805, -14.9976, -15.6225, -11.5531, -6.76467, -3.0423, -0.320394, 1.52807, 2.63919, 2.40304, -4.89467e-10], "shear_above_kN_per_m": [0, -4.96917, -9.6359, -15.5911, -16.9409, 30.2563, 21.9415, 12.8775, 3.0643, -7.49805, -14.9976, -15.6225, -11.5531, -6.76467, -3.0423, -0.320394, 1.52807, 2.63919, 2.40304, -4.89467e-10], "shear_below_kN_per_m": [-5.08065e-11, -4.96917, -9.6359, -15.5911, 36.185, 30.2563, 21.9415, 12.8775, 3.0643, -7.49805, -14.9976, -15.6225, -11.5531, -6.76467, -3.0423, -0.320394, 1.52807, 2.63919, 2.40304, 0], "net_soil_pressure_kPa": [-11.8255, -8.09976, -10.6129, -13.2661, -13.7967, -15.9193, -17.4213, -18.9233, -20.4253, -21.927, -8.14403, 5.63896, 10.6786, 8.52182, 6.40408, 4.51016, 2.90179, 1.5536, -2.50051, -7.13512], "left_soil_pressure_kPa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0003057, 15.2853, 30.5703, 37.112, 36.4572, 35.8415, 35.4495, 35.3432, 35.497, 35.8294, 36.2375], "right_soil_pressure_kPa": [11.8255, 8.09976, 10.6129, 13.2661, 13.7967, 15.9193, 17.4213, 18.9233, 20.4253, 21.9273, 23.4293, 24.9313, 26.4334, 27.9354, 29.4374, 30.9394, 32.4414, 33.9434, 38.3299, 43.3726], "water_pressure_kPa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "branch_state": ["inactive/neutral", "inactive/neutral", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "passive/active", "passive/active", "passive/active", "neutral/active", "neutral/active", "neutral/active", "neutral/active", "neutral/active", "neutral/active", "neutral/neutral", "neutral/neutral"], "left_branch": ["inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "passive", "passive", "passive", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"], "right_branch": ["neutral", "neutral", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "neutral", "neutral"] }, { "name": "Deepen excavation to -5.0 m", "phase_index": 2, "converged": true, "iterations": 3, "levels_m": [0, -0.5, -1, -1.5, -1.6, -2, -2.5, -3, -3.5, -4, -4.5, -5, -5.5, -6, -6.5, -7, -7.5, -8, -8.5, -9], "displacement_mm": [-0.0597069, -0.65341, -1.25198, -1.86643, -1.9928, -2.50719, -3.12617, -3.65737, -4.04954, -4.26786, -4.2953, -4.13384, -3.80587, -3.3532, -2.82734, -2.27752, -1.73886, -1.22441, -0.731043, -0.248371], "rotation_mrad": [-1.18617, -1.18988, -1.20795, -1.25647, -1.27121, -1.28387, -1.16986, -0.93778, -0.619207, -0.24834, 0.138009, 0.500419, 0.796865, 0.995988, 1.09038, 1.09655, 1.05426, 1.00508, 0.972328, 0.961851], "moment_kNm_per_m": [2.27374e-13, -1.06782, -4.12053, -9.81943, -11.3561, 6.80973, 25.9431, 40.7286, 50.79, 55.7515, 55.2378, 48.8744, 36.2876, 20.9161, 6.19914, -4.42425, -7.72608, -6.40057, -3.0097, 0], "shear_kN_per_m": [6.00728e-11, -4.16225, -8.79405, -14.7492, 48.1222, 42.1935, 33.8787, 24.8147, 15.0015, 4.43914, -6.87239, -18.9331, -27.931, -30.0543, -25.3028, -13.8871, -1.93947, 4.75165, 6.43473, -2.48714e-10], "shear_above_kN_per_m": [0, -4.16225, -8.79405, -14.7492, -16.0991, 42.1935, 33.8787, 24.8147, 15.0015, 4.43914, -6.87239, -18.9331, -27.931, -30.0543, -25.3028, -13.8871, -1.93947, 4.75165, 6.43473, -2.48714e-10], "shear_below_kN_per_m": [6.00728e-11, -4.16225, -8.79405, -14.7492, 48.1222, 42.1935, 33.8787, 24.8147, 15.0015, 4.43914, -6.87239, -18.9331, -27.931, -30.0543, -25.3028, -13.8871, -1.93947, 4.75165, 6.43473, 0], "net_soil_pressure_kPa": [-8.73008, -7.95968, -10.6129, -13.2661, -13.7967, -15.9193, -17.4213, -18.9233, -20.4253, -21.9273, -23.4293, -24.931, -11.148, 2.63494, 16.4179, 29.3562, 18.5512, 8.27872, -1.52992, -24.2718], "left_soil_pressure_kPa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0003057, 15.2853, 30.5703, 45.8553, 60.2956, 50.9926, 42.2221, 33.9155, 25.8441], "right_soil_pressure_kPa": [8.73008, 7.95968, 10.6129, 13.2661, 13.7967, 15.9193, 17.4213, 18.9233, 20.4253, 21.9273, 23.4293, 24.9313, 26.4334, 27.9354, 29.4374, 30.9394, 32.4414, 33.9434, 35.4454, 50.116], "water_pressure_kPa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "branch_state": ["inactive/neutral", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "inactive/active", "passive/active", "passive/active", "passive/active", "passive/active", "neutral/active", "neutral/active", "neutral/active", "neutral/active", "neutral/neutral"], "left_branch": ["inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "inactive", "passive", "passive", "passive", "passive", "neutral", "neutral", "neutral", "neutral", "neutral"], "right_branch": ["neutral", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "active", "neutral"] }] }, "assumptions": ["Wall solved as a 2 DOF Euler-Bernoulli beam line.", "Soil response represented by left/right capped Winkler-type springs with carried offsets.", "Section-derived steel wall check per metre: M_Rd = W_pl f_y / gamma_M0 and V_Rd = A_v f_y / (sqrt(3) gamma_M0) (EN 1993-5 5.2.2), cross-section class 1 or 2 assumed. Built-in sections use the ArcelorMittal catalogue W_pl and A_v = t_w (h - t_f) per web (EN 1993-5 5.2.2(4)). Not checked: class 3 sections (W_el), the U-pile factor beta_B, corrosion, M-V and M-N interaction, shear and flexural buckling.", "Inclined walls use an approximate horizontal-component treatment for soil and water loads based on the wall angle from vertical."], "source_refs": ["EN 1997-1:2004 Eurocode 7: Geotechnical design - Part 1, section 9 (retaining structures; 9.3.2.2 unforeseen excavation in ec7 mode)", "Deltares, D-Sheet Piling user manual: soil spring model between active and passive limits, staged construction and the Eurocode 7 verification procedure (design approach 1, sets 1 and 2)", "CUR 166 Damwandconstructies: multilinear bedding (CUR secant moduli) and the Culmann earth-pressure method", "EN 1993-5:2007 Eurocode 3: Design of steel structures - Part 5: Piling, 5.2.2 (section-derived sheet-pile wall resistances)", "ArcelorMittal Sheet Piling products database, AZ, AZ-700 and AZ-770 section properties (built-in sheet-pile library), https://sheetpiling.arcelormittal.com/products/az-sections"], "warnings": ["NODAL_PRESSURE_LUMPING"] };
// END GENERATED DEMO_RESULT
SAMPLE_RESULT.normalized_input = structuredClone(SAMPLE_PROJECT);
SAMPLE_RESULT.visualization = {
    phases: SAMPLE_RESULT.phases.map((phase, phaseIndex) => ({
        name: phase.name,
        phase_index: phase.phase_index ?? phaseIndex,
        converged: phase.converged ?? true,
        iterations: phase.iterations ?? 0,
        levels_m: phase.sampled_results.map((item) => item.level_m),
        displacement_mm: phase.sampled_results.map((item) => item.displacement_mm),
        rotation_mrad: phase.sampled_results.map((item) => item.rotation_mrad),
        moment_kNm_per_m: phase.sampled_results.map((item) => item.moment_kNm_per_m),
        shear_kN_per_m: phase.sampled_results.map((item) => item.shear_kN_per_m),
        net_soil_pressure_kPa: phase.sampled_results.map((item) => item.net_soil_pressure_kPa),
        water_pressure_kPa: phase.sampled_results.map((item) => item.water_pressure_kPa),
        branch_state: phase.sampled_results.map((item) => item.branch_state),
        left_branch: phase.sampled_results.map((item) => item.left_branch ?? String(item.branch_state ?? "").split("/")[0] ?? "n/a"),
        right_branch: phase.sampled_results.map((item) => item.right_branch ?? String(item.branch_state ?? "").split("/")[1] ?? "n/a"),
    })),
};
export const SAMPLE_CONTACT_STATE = {
    projectName: "Basement wall study",
    email: "engineer@example.com",
    message: "Please review the staged excavation response and advise on anchor reserve.",
    consent: true,
};
let turnstileScriptPromise = null;
export function resetTurnstileLoaderForTests() {
    turnstileScriptPromise = null;
}
export function formatNumber(value, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}
function numberOrUndefined(value) {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}
export function formatJson(value) {
    return JSON.stringify(value, null, 2);
}
function optionalNumberLabel(value, digits = 2, prefix = "", suffix = "") {
    if (value === undefined || value === null || !Number.isFinite(value)) {
        return "";
    }
    return `${prefix}${formatNumber(value, digits)}${suffix}`;
}
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function normalizeFileSlug(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "retaining-analysis";
}
export function buildPlotPath(levels, values, width = 360, height = 180) {
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
function visualizationPhaseForResult(result, phaseIndex) {
    const phases = result?.visualization?.phases;
    const phase = result?.phases?.[phaseIndex];
    if (!Array.isArray(phases) || !phase) {
        return null;
    }
    const targetPhaseIndex = phase?.phase_index ?? phaseIndex;
    return (phases.find((item) => item?.phase_index === targetPhaseIndex) ??
        phases.find((item) => item?.name === phase.name) ??
        phases[phaseIndex] ??
        null);
}
function isPlotArray(value, expectedLength) {
    return Array.isArray(value) && value.length === expectedLength;
}
function resultPhaseForView(result, phaseIndex, view = "characteristic") {
    if (view !== "characteristic" && result?.ec7_verification?.sets) {
        const setResult = result.ec7_verification.sets.find((item) => item?.set === view);
        return setResult?.phases?.[phaseIndex] ?? result?.phases?.[phaseIndex];
    }
    return result?.phases?.[phaseIndex];
}
function buildPhasePlotData(result, phaseIndex, view = "characteristic") {
    const phase = resultPhaseForView(result, phaseIndex, view);
    const sampledResults = phase?.sampled_results ?? [];
    const sampled = {
        levels: sampledResults.map((item) => item.level_m),
        displacement: sampledResults.map((item) => item.displacement_mm),
        rotation: sampledResults.map((item) => item.rotation_mrad),
        moment: sampledResults.map((item) => item.moment_kNm_per_m),
        shear: sampledResults.map((item) => item.shear_kN_per_m),
        pressure: sampledResults.map((item) => item.net_soil_pressure_kPa),
        waterPressure: sampledResults.map((item) => item.water_pressure_kPa),
        branchState: sampledResults.map((item) => item.branch_state),
        source: "sampled_results",
    };
    const visualizationPhase = view === "characteristic" ? visualizationPhaseForResult(result, phaseIndex) : null;
    const expectedLength = visualizationPhase?.levels_m?.length ?? 0;
    if (visualizationPhase &&
        expectedLength > 0 &&
        isPlotArray(visualizationPhase.displacement_mm, expectedLength) &&
        isPlotArray(visualizationPhase.rotation_mrad, expectedLength) &&
        isPlotArray(visualizationPhase.moment_kNm_per_m, expectedLength) &&
        isPlotArray(visualizationPhase.shear_kN_per_m, expectedLength) &&
        isPlotArray(visualizationPhase.net_soil_pressure_kPa, expectedLength) &&
        isPlotArray(visualizationPhase.water_pressure_kPa, expectedLength) &&
        isPlotArray(visualizationPhase.branch_state, expectedLength)) {
        return {
            levels: visualizationPhase.levels_m,
            displacement: visualizationPhase.displacement_mm,
            rotation: visualizationPhase.rotation_mrad,
            moment: visualizationPhase.moment_kNm_per_m,
            shear: visualizationPhase.shear_kN_per_m,
            pressure: visualizationPhase.net_soil_pressure_kPa,
            waterPressure: visualizationPhase.water_pressure_kPa,
            branchState: visualizationPhase.branch_state,
            source: "visualization",
        };
    }
    return sampled;
}
/**
 * Shear jumps at every node by the lumped spring/support force (large at
 * anchors and props). When the API returns the shear just above and just
 * below each node, plot it as a stepped diagram; otherwise use the nodal value.
 */
export function buildSteppedShearSeries(result, phaseIndex, phaseOverride) {
    const visualizationPhase = phaseOverride ? null : visualizationPhaseForResult(result, phaseIndex);
    const sampledResults = phaseOverride?.sampled_results ?? result?.phases?.[phaseIndex]?.sampled_results ?? [];
    const levels = visualizationPhase?.levels_m ?? sampledResults.map((item) => item.level_m);
    const above = visualizationPhase?.shear_above_kN_per_m ??
        (sampledResults.length ? sampledResults.map((item) => item.shear_above_kN_per_m) : undefined);
    const below = visualizationPhase?.shear_below_kN_per_m ??
        (sampledResults.length ? sampledResults.map((item) => item.shear_below_kN_per_m) : undefined);
    const isFiniteSeries = (value) => isPlotArray(value, levels?.length ?? -1) && value.every((item) => Number.isFinite(item));
    if (!levels?.length || !isFiniteSeries(above) || !isFiniteSeries(below)) {
        return undefined;
    }
    const aboveValues = above;
    const belowValues = below;
    const steppedLevels = [];
    const steppedValues = [];
    levels.forEach((level, index) => {
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
export function governingPhaseIndex(result, phaseCount) {
    const phases = result?.phases ?? [];
    const failed = phases.findIndex((phase) => phase?.converged === false);
    if (failed >= 0)
        return Math.min(failed, Math.max(0, phaseCount - 1));
    const governingName = result?.governing?.max_abs_moment_phase;
    const governing = phases.findIndex((phase) => phase?.name === governingName);
    const index = governing >= 0 ? governing : phases.length - 1;
    return Math.max(0, Math.min(index, phaseCount - 1));
}
function plotSourceDescription(source, quantity) {
    if (source === "visualization") {
        return `Direct API visualization ${quantity}, without client-side mechanics.`;
    }
    return `Fallback ${quantity} from sampled results because visualization arrays were unavailable.`;
}
export function buildInputSnapshot(project, phaseIndex = 0) {
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
    const segmentCrackedLabel = primarySegment?.cracked_ei_kNm2_per_m !== undefined
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
            text: `${project.design_mode.toUpperCase()} · ${project.phases.length} phase(s) · target element length ${formatNumber(targetElementLengthM, 2)} m · max wall displacement (project limit) ${Number.isFinite(maxWallDisplacementMm) ? `${formatNumber(maxWallDisplacementMm, 2)} mm` : "not declared"}`,
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
            text: `${project.supports.length} support item(s), ${project.supports.filter((item) => item.type === "anchor" || item.type === "strut" || item.type === "underwater_concrete_block").length} one-sided support(s) · types ${supportTypes.join(", ")} · first support phase window ${firstSupportPhaseWindow} · max inclination ${formatNumber(Math.max(0, ...project.supports.map((item) => item.inclination_degrees ?? 0)), 1)}°`,
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
function buildSteelSectionLabel(section) {
    if (!section) {
        return "";
    }
    const libraryLabel = section.library_section_id
        ? STEEL_SHEET_PILE_LIBRARY[section.library_section_id]?.label
        : "";
    return section.section_name || libraryLabel || "manual section";
}
function buildWallSectionMetadata(project) {
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
function steelSectionForProject(project) {
    const segment = project.wall_geometry.segments[0];
    return segment?.steel_section || {};
}
function wallLengthSearchForProject(project) {
    return project.design_options?.wall_length_search;
}
function defaultSteelGammaM0(designMode) {
    return designMode === "ec7" ? 1.1 : 1;
}
function ec7PartialFactorsForProject(project) {
    return {
        set1: { ...EC7_PARTIAL_FACTOR_DEFAULTS.set1, ...(project.ec7_partial_factors?.set1 ?? {}) },
        set2: { ...EC7_PARTIAL_FACTOR_DEFAULTS.set2, ...(project.ec7_partial_factors?.set2 ?? {}) },
    };
}
export function resetEc7PartialFactors(project) {
    return {
        ...structuredClone(project),
        ec7_partial_factors: structuredClone(EC7_PARTIAL_FACTOR_DEFAULTS),
    };
}
const EC7_ACTION_TYPES = [
    { value: "permanent_unfavourable", label: "Permanent – unfavourable" },
    { value: "permanent_favourable", label: "Permanent – favourable" },
    { value: "variable_unfavourable", label: "Variable – unfavourable" },
    { value: "variable_favourable", label: "Variable – favourable" },
];
function ec7ActionTypeSelect(attribute, selected) {
    const value = selected ?? "variable_unfavourable";
    return `<select ${attribute} aria-label="${attribute.replaceAll("data-qe-", "").replaceAll("-", " ")}">${EC7_ACTION_TYPES.map((item) => `<option value="${item.value}" ${item.value === value ? "selected" : ""}>${item.label}</option>`).join("")}</select>`;
}
export function ec7FactorEditorValuesToState(values) {
    const state = structuredClone(values);
    for (const setName of ["set1", "set2"]) {
        if (typeof state[setName].overdig_fraction === "number") {
            state[setName].overdig_fraction /= 100;
        }
    }
    return state;
}
function readEc7FactorInputs(root) {
    const factors = { set1: {}, set2: {} };
    root.querySelectorAll("[data-qe-ec7-factor]").forEach((input) => {
        const [setName, fieldName] = (input.dataset.qeEc7Factor ?? "").split(".");
        const value = numberOrUndefined(input.value);
        if ((setName === "set1" || setName === "set2") && fieldName && value !== undefined) {
            factors[setName][fieldName] = value;
        }
    });
    return ec7FactorEditorValuesToState(factors);
}
function ec7FactorBlock(project) {
    if (project.design_mode !== "ec7")
        return "";
    const factors = ec7PartialFactorsForProject(project);
    const rows = [
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
    const inputs = (setName, field, percent = false) => {
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
export function buildAnalysisPayload(project) {
    const payload = structuredClone(project);
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
    }
    else {
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
            }
            else {
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
function targetElementLengthForProject(project) {
    return project?.design_options?.target_element_length_m ?? 0.5;
}
function targetElementLengthForResult(result) {
    return result?.normalized_input?.design_options?.target_element_length_m ?? 0.5;
}
function isDisplayProjectCandidate(value) {
    return Boolean(value &&
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
        Array.isArray(value.supports));
}
export function resolveAnalyzedProject(project, result) {
    return isDisplayProjectCandidate(result?.normalized_input)
        ? result.normalized_input
        : project;
}
function buildDiscretizationSummary(result) {
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
function buildDiscretizationRows(result) {
    const nodeLevels = result?.discretization?.node_levels_m;
    const elementLengths = result?.discretization?.element_lengths_m;
    if (!Array.isArray(nodeLevels) || !nodeLevels.length) {
        return `<tr><td colspan="3">No discretization metadata returned.</td></tr>`;
    }
    return nodeLevels.map((level, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(formatNumber(level, 2))}</td>
      <td>${index < (elementLengths?.length ?? 0) ? `${escapeHtml(formatNumber(elementLengths[index], 2))} m` : "n/a"}</td>
    </tr>
  `).join("");
}
function supportTypeLabel(type) {
    return type.replaceAll("_", " ");
}
function firstSoilLayerForSide(project, side) {
    return project.soil_profiles[side].layers[0];
}
function buildSoilLayerSummary(sideLabel, layer) {
    if (!layer) {
        return `${sideLabel}: none`;
    }
    const overrides = [
        optionalNumberLabel(layer.at_rest_coefficient, 2, "K0 "),
        optionalNumberLabel(layer.active_coefficient, 2, "Ka "),
        optionalNumberLabel(layer.passive_coefficient, 2, "Kp "),
        optionalNumberLabel(layer.pore_pressure_offset_kPa, 1, "Δu ", " kPa"),
    ].filter(Boolean);
    const beddingSummary = layer.bedding_model === "tri_linear" &&
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
export function buildProjectPhaseOptions(project) {
    return project.phases.map((phase, index) => ({
        index,
        label: `${index + 1}. ${phase.name}`,
    }));
}
export function buildPhaseOptions(result) {
    return result.phases.map((phase, index) => ({
        index,
        label: `${index + 1}. ${phase.name}`,
    }));
}
function clampIndex(value, length) {
    if (!length) {
        return 0;
    }
    const normalized = Number.isFinite(value) ? Math.round(value) : 0;
    return Math.max(0, Math.min(length - 1, normalized));
}
function normalizeEditorFocus(project, focus = {}) {
    return {
        segmentIndex: clampIndex(focus.segmentIndex, project.wall_geometry.segments.length),
        leftLayerIndex: clampIndex(focus.leftLayerIndex, project.soil_profiles.left.layers.length),
        rightLayerIndex: clampIndex(focus.rightLayerIndex, project.soil_profiles.right.layers.length),
        supportIndex: clampIndex(focus.supportIndex, project.supports.length),
    };
}
function midpointLevel(topLevelM, bottomLevelM) {
    return (topLevelM + bottomLevelM) / 2;
}
function nextSupportId(existingSupports, baseId = "S") {
    const existing = new Set(existingSupports.map((support) => support.id));
    let candidateIndex = existingSupports.length + 1;
    let candidate = `${baseId}${candidateIndex}`;
    while (existing.has(candidate)) {
        candidateIndex += 1;
        candidate = `${baseId}${candidateIndex}`;
    }
    return candidate;
}
function mapFiniteSupportWindow(support, phaseCount, transform) {
    const start = Math.max(0, Math.min(phaseCount - 1, support.active_from_phase ?? 0));
    const end = support.active_to_phase === undefined
        ? start
        : Math.max(start, Math.min(phaseCount - 1, support.active_to_phase));
    const mapped = new Set();
    for (let phaseIndex = start; phaseIndex <= end; phaseIndex += 1) {
        const transformed = transform(phaseIndex);
        if (transformed !== null) {
            mapped.add(transformed);
        }
    }
    return [...mapped].sort((left, right) => left - right);
}
function shiftSupportsForPhaseInsert(supports, selectedPhaseIndex, phaseCountBeforeInsert) {
    const insertIndex = selectedPhaseIndex + 1;
    for (const support of supports) {
        if (support.active_to_phase === undefined) {
            if ((support.active_from_phase ?? 0) > selectedPhaseIndex) {
                support.active_from_phase = (support.active_from_phase ?? 0) + 1;
            }
            continue;
        }
        const mapped = mapFiniteSupportWindow(support, phaseCountBeforeInsert, (phaseIndex) => {
            if (phaseIndex > selectedPhaseIndex) {
                return phaseIndex + 1;
            }
            if (phaseIndex === selectedPhaseIndex) {
                return phaseIndex;
            }
            return phaseIndex;
        });
        if (mapped.includes(selectedPhaseIndex)) {
            mapped.push(insertIndex);
        }
        const normalized = [...new Set(mapped)].sort((left, right) => left - right);
        support.active_from_phase = normalized[0];
        support.active_to_phase = normalized[normalized.length - 1];
    }
}
function shiftSupportsForPhaseRemoval(supports, removedPhaseIndex, phaseCountBeforeRemoval, phaseCountAfterRemoval) {
    const lastPhaseIndex = Math.max(0, phaseCountAfterRemoval - 1);
    for (const support of supports) {
        if (support.active_to_phase === undefined) {
            const start = support.active_from_phase ?? 0;
            if (start > removedPhaseIndex) {
                support.active_from_phase = start - 1;
            }
            else {
                support.active_from_phase = Math.min(start, lastPhaseIndex);
            }
            continue;
        }
        const mapped = mapFiniteSupportWindow(support, phaseCountBeforeRemoval, (phaseIndex) => {
            if (phaseIndex === removedPhaseIndex) {
                return null;
            }
            return phaseIndex > removedPhaseIndex ? phaseIndex - 1 : phaseIndex;
        });
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
export function applyQuickEditorStructureAction(project, focus = {}, action, phaseIndex = 0) {
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
        shiftSupportsForPhaseRemoval(nextProject.supports, removedPhaseIndex, phaseCountBeforeRemoval, nextProject.phases.length);
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
        }
        else {
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
    const splitLayer = (side) => {
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
    const removeLayer = (side) => {
        const layers = nextProject.soil_profiles[side].layers;
        const layerIndex = side === "left" ? focusState.leftLayerIndex : focusState.rightLayerIndex;
        if (layers.length <= 1) {
            return null;
        }
        const removed = layers[layerIndex];
        if (layerIndex === 0) {
            layers[1].top_level_m = removed.top_level_m;
        }
        else {
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
            type: "anchor",
            depth_m: 2,
            side: "right",
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
function activePhaseForProject(project, phaseIndex) {
    return project.phases[Math.max(0, Math.min(project.phases.length - 1, phaseIndex))];
}
export function buildGeometryPreviewSvg(project, phaseIndex = 0) {
    const phase = activePhaseForProject(project, phaseIndex);
    const wallTop = project.wall_geometry.top_level_m;
    const wallToe = project.wall_geometry.toe_level_m;
    const leftSurfaceLevel = phase.surface_level_left_m ?? wallTop;
    const rightSurfaceLevel = phase.surface_level_right_m ?? wallTop;
    const minLevel = Math.min(wallToe, ...project.soil_profiles.left.layers.map((layer) => layer.bottom_level_m), ...project.soil_profiles.right.layers.map((layer) => layer.bottom_level_m));
    const maxLevel = Math.max(wallTop, leftSurfaceLevel, rightSurfaceLevel);
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
    const scaleY = (levelM) => topPad + ((maxLevel - levelM) / Math.max(1e-9, maxLevel - minLevel)) * (height - topPad - bottomPad);
    const wallAxisX = (levelM) => {
        const y = scaleY(levelM);
        const normalized = (y - topPad) / Math.max(1e-9, height - topPad - bottomPad);
        return wallX + (wallBottomX - wallX) * normalized;
    };
    const layerCaption = (layer) => {
        const namedLayer = layer.name || layer.label;
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
        const supportStartPhase = support.active_from_phase ?? 0;
        const supportEndPhase = support.active_to_phase ?? Number.POSITIVE_INFINITY;
        return phaseIndex >= supportStartPhase && phaseIndex <= supportEndPhase;
    });
    const supports = activeSupports
        .map((support) => {
        const y = scaleY(project.wall_geometry.top_level_m - support.depth_m);
        const supportWallX = wallAxisX(project.wall_geometry.top_level_m - support.depth_m);
        // The API side of an anchor or strut is the direction of its force on the wall.
        // An anchor sits on that side (it pulls); a strut stands on the other side (it pushes),
        // so a strut is drawn in the excavation.
        const forceSide = support.side ?? "right";
        const supportSide = support.type === "strut" ? (forceSide === "left" ? "right" : "left") : forceSide;
        const supportColor = support.type === "strut" ? "#8b5e00" : supportSide === "left" ? "#8b5e00" : "#0b6e4f";
        const supportLabel = `${support.id} ${support.type === "strut" ? "prop" : supportTypeLabel(support.type)}`;
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
    const tickLevels = [];
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
    const surchargeArrow = (x, y, value, anchor) => value > 0
        ? `<line x1="${x}" y1="${(y - 35).toFixed(1)}" x2="${x}" y2="${(y - 8).toFixed(1)}" stroke="#9b2226" stroke-width="3"></line><polygon points="${x - 6},${(y - 12).toFixed(1)} ${x + 6},${(y - 12).toFixed(1)} ${x},${(y - 2).toFixed(1)}" fill="#9b2226"></polygon><text x="${x + (anchor === "start" ? 9 : -9)}" y="${(y - 21).toFixed(1)}" text-anchor="${anchor}" font-size="17" font-weight="700" fill="#7c2020">${formatNumber(value, 1)} kPa</text>`
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
        <line x1="${leftSoilX}" y1="${leftSurfaceY.toFixed(1)}" x2="${wallAxisX(leftSurfaceLevel).toFixed(1)}" y2="${leftSurfaceY.toFixed(1)}" stroke="#7d5a36" stroke-width="2" stroke-dasharray="5 5"></line>
        <line x1="${wallAxisX(rightSurfaceLevel).toFixed(1)}" y1="${rightSurfaceY.toFixed(1)}" x2="${rightSoilX}" y2="${rightSurfaceY.toFixed(1)}" stroke="#7d5a36" stroke-width="2" stroke-dasharray="5 5"></line>
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
function buildTabbedQuickEditorHtml(flatMarkup) {
    const tabDefinitions = [
        { id: "general", label: "General" },
        { id: "wall", label: "Wall" },
        { id: "soils", label: "Soils" },
        { id: "phases", label: "Phases" },
        { id: "supports", label: "Supports" },
        { id: "json", label: "JSON" },
    ];
    const grouped = new Map(tabDefinitions.map((tab) => [tab.id, []]));
    const ec7Block = flatMarkup.match(/<section class="ec7-factor-block"[\s\S]*?<\/section>/)?.[0];
    const markupWithoutEc7Block = ec7Block ? flatMarkup.replace(ec7Block, "") : flatMarkup;
    const items = markupWithoutEc7Block.match(/<label class="quick-editor-field">[\s\S]*?<\/label>|<div class="quick-editor-actions">[\s\S]*?<\/div>|<p class="quick-editor-note">[\s\S]*?<\/p>/g) ?? [];
    for (const item of items) {
        let group = "general";
        if (/data-qe-support-(?:index|id|type|side|depth|active|inclination|stiffness|prestress|capacity|force|moment|action-type)|anchor-inclination|support_(?:add|remove)/.test(item)) {
            group = "supports";
        }
        else if (/data-qe-(?:left-|right-)|left_layer_|right_layer_/.test(item)) {
            group = "soils";
        }
        else if (/data-qe-phase-name|phase_(?:duplicate|remove)|data-qe-(?:surface|exc-|gw-|sur-|vertical-load|vertical-line-load-action|second-order|surcharge-.*-action)/.test(item)) {
            group = "phases";
        }
        else if (/data-qe-(?:segment|library|section-name|wpl|av|fy|gamma-m0)|segment_(?:split|remove)/.test(item)) {
            group = "wall";
        }
        grouped.get(group)?.push(item);
    }
    if (ec7Block)
        grouped.get("general")?.push(ec7Block);
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
export function buildQuickEditorHtml(project, phaseIndex = 0, focus = {}) {
    const phase = activePhaseForProject(project, phaseIndex);
    const focusState = normalizeEditorFocus(project, focus);
    const wallLengthSearch = wallLengthSearchForProject(project);
    const gammaM0Default = defaultSteelGammaM0(project.design_mode);
    const toeControlMode = wallLengthSearch ? "search" : "fixed";
    const selectedSupport = project.supports[focusState.supportIndex];
    const leftLayer = project.soil_profiles.left.layers[focusState.leftLayerIndex];
    const rightLayer = project.soil_profiles.right.layers[focusState.rightLayerIndex];
    const selectedSegment = project.wall_geometry.segments[focusState.segmentIndex];
    const section = selectedSegment?.steel_section || {};
    const libraryOptions = Object.entries(STEEL_SHEET_PILE_LIBRARY).map(([id, item]) => `
    <option value="${escapeHtml(id)}" ${section.library_section_id === id ? "selected" : ""}>${escapeHtml(item.label)}</option>
  `).join("");
    const selectedLibrarySection = section.library_section_id
        ? STEEL_SHEET_PILE_LIBRARY[section.library_section_id]
        : undefined;
    const librarySectionNote = selectedLibrarySection
        ? `<p class="quick-editor-note"><span data-qe-library-note>${escapeHtml(`${selectedLibrarySection.label}, ArcelorMittal catalogue: Wpl ${formatNumber(selectedLibrarySection.plastic_section_modulus_cm3_per_m, 0)} cm3/m, ` +
            `Wel ${formatNumber(selectedLibrarySection.elastic_section_modulus_cm3_per_m, 0)} cm3/m, ` +
            `Av ${formatNumber(selectedLibrarySection.shear_area_cm2_per_m, 1)} cm2/m (EN 1993-5 5.2.2(4)), ` +
            `I ${formatNumber(selectedLibrarySection.moment_of_inertia_cm4_per_m, 0)} cm4/m, ` +
            `EI ${formatNumber(selectedLibrarySection.ei_kNm2_per_m, 0)} kNm2/m. Choosing a section sets the segment EI to this value.`)}</span></p>`
        : "";
    const wallTypeSpecificSectionControls = project.wall_type === "steel_sheet_pile"
        ? `
      <label class="quick-editor-field"><span>Steel section</span><select data-qe-library><option value="" ${section.library_section_id ? "" : "selected"}>Manual / custom</option>${libraryOptions}</select></label>
      ${librarySectionNote}
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
      <label class="quick-editor-field" title="Anchors and props: the side the support force pulls or pushes the wall towards (normally the retained side). Point loads and moments: the side they act from."><span>Support side</span><select data-qe-support-side><option value="right" ${selectedSupport?.side !== "left" ? "selected" : ""}>Right</option><option value="left" ${selectedSupport?.side === "left" ? "selected" : ""}>Left</option></select></label>
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
export function reconcileQuickEditorEventPatch(changedField, patch) {
    const reconciled = { ...patch };
    if (changedField === "top_level_m") {
        delete reconciled.segment_top_level_m;
    }
    else if (changedField === "toe_level_m") {
        delete reconciled.segment_bottom_level_m;
    }
    else if (changedField === "segment_top_level_m") {
        delete reconciled.top_level_m;
    }
    else if (changedField === "segment_bottom_level_m") {
        delete reconciled.toe_level_m;
    }
    else if (changedField === "design_mode") {
        reconciled.gamma_m0 = defaultSteelGammaM0(reconciled.design_mode);
    }
    return reconciled;
}
export function applyQuickEditorPatch(project, phaseIndex, patch, focus = {}) {
    const nextProject = structuredClone(project);
    const focusState = normalizeEditorFocus(nextProject, focus);
    nextProject.design_options = {
        ...(nextProject.design_options || {}),
        target_element_length_m: patch.target_element_length_m ??
            nextProject.design_options?.target_element_length_m ??
            0.5,
        max_wall_displacement_mm: patch.max_wall_displacement_mm ??
            nextProject.design_options?.max_wall_displacement_mm,
    };
    const nextWallLengthSearch = nextProject.design_options?.wall_length_search;
    nextProject.wall_type = patch.wall_type ?? nextProject.wall_type;
    nextProject.design_mode = patch.design_mode ?? nextProject.design_mode;
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
        const searchStartToeLevelM = patch.search_start_toe_level_m ??
            nextWallLengthSearch?.start_toe_level_m ??
            nextProject.wall_geometry.toe_level_m;
        nextProject.design_options = {
            ...(nextProject.design_options || {}),
            wall_length_search: {
                start_toe_level_m: searchStartToeLevelM,
                minimum_toe_level_m: patch.search_minimum_toe_level_m ??
                    nextWallLengthSearch?.minimum_toe_level_m ??
                    searchStartToeLevelM - 1,
                step_m: patch.search_step_m ??
                    nextWallLengthSearch?.step_m ??
                    0.5,
                max_head_displacement_mm: patch.search_max_head_displacement_mm ??
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
        const previousLibrarySectionId = selectedSegment.steel_section?.library_section_id;
        const librarySectionId = patch.library_section_id === ""
            ? undefined
            : patch.library_section_id ?? previousLibrarySectionId;
        // Choosing another built-in section sets EI = E I of that section, so the
        // stiffness cannot contradict the chosen profile; EI can be edited afterwards.
        const newlySelectedCatalogueSection = librarySectionId !== undefined && librarySectionId !== previousLibrarySectionId
            ? STEEL_SHEET_PILE_LIBRARY[librarySectionId]
            : undefined;
        selectedSegment.ei_kNm2_per_m = newlySelectedCatalogueSection
            ? newlySelectedCatalogueSection.ei_kNm2_per_m
            : patch.segment_ei_kNm2_per_m ?? selectedSegment.ei_kNm2_per_m;
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
            section_name: patch.section_name ?? selectedSegment.steel_section?.section_name,
            plastic_section_modulus_cm3_per_m: patch.plastic_section_modulus_cm3_per_m ?? selectedSegment.steel_section?.plastic_section_modulus_cm3_per_m,
            shear_area_cm2_per_m: patch.shear_area_cm2_per_m ?? selectedSegment.steel_section?.shear_area_cm2_per_m,
            steel_grade_mpa: patch.steel_grade_mpa ?? selectedSegment.steel_section?.steel_grade_mpa ?? 355,
            gamma_m0: patch.gamma_m0 ??
                selectedSegment.steel_section?.gamma_m0 ??
                defaultSteelGammaM0(nextProject.design_mode),
        };
        if (focusState.segmentIndex === 0 && patch.segment_top_level_m !== undefined) {
            nextProject.wall_geometry.top_level_m = patch.segment_top_level_m;
        }
        if (focusState.segmentIndex === nextProject.wall_geometry.segments.length - 1 &&
            patch.segment_bottom_level_m !== undefined) {
            nextProject.wall_geometry.toe_level_m = patch.segment_bottom_level_m;
        }
    }
    if (nextProject.phases[phaseIndex]) {
        nextProject.phases[phaseIndex].name =
            patch.phase_name ?? nextProject.phases[phaseIndex].name;
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
function buildSvgPlot(levels, values, cssClass, label, unit) {
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
    const scaleX = (value) => plotLeft + ((value - minValue) / (maxValue - minValue)) * (plotRight - plotLeft);
    const scaleY = (level) => plotTop + ((maxLevel - level) / Math.max(1e-9, maxLevel - minLevel)) * (plotBottom - plotTop);
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
    const color = {
        displacement: "#0b6e4f",
        rotation: "#527e91",
        moment: "#3a596a",
        shear: "#8f3a3a",
        pressure: "#9b6b43",
        water: "#2f8fda",
    }[cssClass] ?? "#0b6e4f";
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
function buildDeformedWallSvg(levels, displacements) {
    return buildSvgPlot(levels, displacements, "displacement", "Wall deformed shape", "mm")
        .replace('class="plot-svg"', 'class="plot-svg deformed-svg"');
}
function governingSupportCheck(result) {
    const supportChecks = result.design_checks?.supports;
    if (!Array.isArray(supportChecks) || !supportChecks.length) {
        return null;
    }
    return supportChecks.reduce((governing, item) => {
        if (!governing) {
            return item;
        }
        return (item.utilization_ratio ?? 0) >= (governing.utilization_ratio ?? 0) ? item : governing;
    }, null);
}
function hasSupportAxialForce(item) {
    return typeof item?.axial_force_kN_per_m === "number";
}
function supportReactionMoment(item) {
    if (typeof item?.reaction_moment_kNm_per_m === "number") {
        return item.reaction_moment_kNm_per_m;
    }
    if (item?.type === "moment" && typeof item?.reaction_kN_per_m === "number") {
        return item.reaction_kN_per_m;
    }
    return undefined;
}
function hasSupportAxialCheck(item) {
    return (typeof item?.axial_demand_kN_per_m === "number" &&
        typeof item?.axial_capacity_kN_per_m === "number");
}
function formatSupportReactionValue(item) {
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
function formatSupportReactionStatus(item) {
    if (item?.utilization_ratio !== undefined) {
        return `utilization ${formatNumber(item.utilization_ratio, 2)}`;
    }
    return item?.branch_state ?? "n/a";
}
function formatSupportCheckDemandCapacity(item) {
    const horizontal = `${formatNumber(item?.demand_kN_per_m ?? 0, 2)} / ${formatNumber(item?.capacity_kN_per_m ?? 0, 2)} kN/m`;
    if (!hasSupportAxialCheck(item)) {
        return horizontal;
    }
    return `${horizontal} · axial ${formatNumber(item.axial_demand_kN_per_m, 2)} / ${formatNumber(item.axial_capacity_kN_per_m, 2)} kN/m`;
}
function renderSupportCheckValueCell(primaryValue, axialValue) {
    const primary = `${formatNumber(primaryValue ?? 0, 2)} kN/m`;
    if (typeof axialValue !== "number") {
        return escapeHtml(primary);
    }
    return `${escapeHtml(primary)}<br><span>Axial ${escapeHtml(formatNumber(axialValue, 2))} kN/m</span>`;
}
function formatSupportReactionHorizontalCell(item) {
    return `${formatNumber(item?.reaction_kN_per_m ?? 0, 2)} kN/m`;
}
function formatSupportReactionMomentCell(item) {
    const supportMoment = supportReactionMoment(item);
    return supportMoment === undefined ? "n/a" : `${formatNumber(supportMoment, 2)} kNm/m`;
}
function formatSupportReactionAxialCell(item) {
    return hasSupportAxialForce(item)
        ? `${formatNumber(item.axial_force_kN_per_m, 2)} kN/m`
        : "n/a";
}
function assessmentStatus(value) {
    if (value === true)
        return "ASSESSED PASS";
    if (value === false)
        return "CHECK";
    return "NOT ASSESSED";
}
function serviceabilityAssessmentStatus(serviceability) {
    return serviceability?.assessed === true
        ? assessmentStatus(serviceability.pass)
        : "NOT ASSESSED";
}
function formatServiceabilityAssessment(serviceability) {
    const maximum = Number.isFinite(serviceability?.max_abs_displacement_mm)
        ? `${formatNumber(serviceability.max_abs_displacement_mm, 2)} mm maximum`
        : "maximum displacement unavailable";
    const limit = Number.isFinite(serviceability?.limit_mm)
        ? `${formatNumber(serviceability.limit_mm, 2)} mm project limit`
        : "project limit not declared";
    return `${maximum} / ${limit} · ${serviceabilityAssessmentStatus(serviceability)}`;
}
function formatSupportReactionDepthCell(item) {
    return item?.depth_m === undefined ? "n/a" : `${formatNumber(item.depth_m, 2)} m`;
}
function buildSupportReactionRows(phase) {
    if (!Array.isArray(phase?.support_reactions) || !phase.support_reactions.length) {
        return `<tr><td colspan="8">No support rows returned for this phase.</td></tr>`;
    }
    return phase.support_reactions.map((item) => `
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
function buildSupportReactionListItems(phase) {
    if (!Array.isArray(phase?.support_reactions) || !phase.support_reactions.length) {
        return `<li>No support rows returned for this phase.</li>`;
    }
    return phase.support_reactions.map((item) => {
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
function buildSupportCheckList(result) {
    const supportChecks = result.design_checks?.supports;
    if (!Array.isArray(supportChecks) || !supportChecks.length) {
        return `<li>No capacity-based support design checks were triggered.</li>`;
    }
    return supportChecks.map((item) => `
    <li>${escapeHtml(item.support_id)} (${escapeHtml(item.support_type ?? "support")}): demand/capacity ${escapeHtml(formatSupportCheckDemandCapacity(item))} · utilization ${formatNumber(item.utilization_ratio ?? 0, 2)} · governing phase ${escapeHtml(item.governing_phase ?? "n/a")} · ${assessmentStatus(item.pass)}</li>
  `).join("");
}
function buildSupportCheckRows(result) {
    const supportChecks = result.design_checks?.supports;
    if (!Array.isArray(supportChecks) || !supportChecks.length) {
        return `<tr><td colspan="7">No capacity-based support design checks were triggered.</td></tr>`;
    }
    return supportChecks.map((item) => `
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
function buildGlobalGoverningRows(result) {
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
function buildWallCheckRows(result) {
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
function buildSampledResultRows(phase) {
    if (!phase?.sampled_results?.length) {
        return `<tr><td colspan="11">No sampled results returned for this phase.</td></tr>`;
    }
    return phase.sampled_results.map((item) => `
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
export function readableWarningMessage(code) {
    if (REMOVED_WARNING_CODES.has(code))
        return "";
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
    return code;
}
function readableWarnings(warnings) {
    return (Array.isArray(warnings) ? warnings : [])
        .map((item) => readableWarningMessage(String(item)))
        .filter(Boolean);
}
function buildResultProvenanceList(result) {
    const warnings = Array.isArray(result?.warnings) ? result.warnings : [];
    const assumptions = result?.ec7_verification
        ? ["See the EC7 verification tables for partial factors, design effects and overdig."]
        : Array.isArray(result?.assumptions) ? result.assumptions : [];
    const sourceRefs = result?.ec7_verification ? [] : Array.isArray(result?.source_refs) ? result.source_refs : [];
    return [
        `<li>Formula version: ${escapeHtml(result?.formula_version || "n/a")}</li>`,
        `<li>Warnings: ${readableWarnings(warnings).length ? readableWarnings(warnings).map((item) => escapeHtml(item)).join(", ") : "none"}</li>`,
        `<li>Assumptions: ${assumptions.length ? assumptions.map((item) => escapeHtml(item)).join(" | ") : "none"}</li>`,
        `<li>Source refs: ${sourceRefs.length ? sourceRefs.map((item) => escapeHtml(item)).join(" | ") : "none"}</li>`,
    ].join("");
}
export function buildPhaseOverview(result, phaseIndex, view = "characteristic") {
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
export function buildResultSummaryItems(result, phaseIndex = 0) {
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
        summary.push(`Wall-length search selected toe: ${formatNumber(result.search_evaluation.selected_toe_level_m, 1)} m`, `Wall-length search stop reason: ${result.search_evaluation.stop_reason}`);
    }
    for (const [index, setResult] of (result?.ec7_verification?.sets ?? []).entries()) {
        const number = setResult.set === "set1" ? 1 : setResult.set === "set2" ? 2 : index + 1;
        summary.push(`EC7 set ${number}: governing |M| ${formatNumber(setResult.governing?.max_abs_moment_kNm_per_m ?? 0, 2)} kNm/m; governing |V| ${formatNumber(setResult.governing?.max_abs_shear_kN_per_m ?? 0, 2)} kN/m; ${setResult.converged === true ? "all phases converged" : "one or more phases did not converge"}`);
        for (const failedPhase of (setResult.phases ?? []).filter((item) => item?.converged === false)) {
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
export function buildPhaseConvergenceAlert(result, phaseIndex) {
    const phase = result?.phases?.[phaseIndex];
    if (phase?.converged === false) {
        return `<div class="phase-alert" role="alert"><strong>No equilibrium found in this phase.</strong> The solver stopped after ${escapeHtml(phase?.iterations ?? "n/a")} iterations. This usually means the wall is unstable here: insufficient embedment, or anchors/props at their capacity. The plotted values are not a valid result — lengthen the wall or add support and run again.</div>`;
    }
    const earlierFailure = (result?.phases ?? [])
        .slice(0, Math.max(0, phaseIndex))
        .find((item) => item?.converged === false);
    if (earlierFailure) {
        return `<div class="phase-alert" role="alert"><strong>An earlier phase did not converge</strong> (${escapeHtml(earlierFailure.name)}). This phase starts from that invalid state, so its values are not a valid result.</div>`;
    }
    return "";
}
const EC7_FACTOR_DISPLAY_ROWS = [
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
function ec7FactorValue(factors, row) {
    const value = Number(factors?.[row.key] ?? 0);
    return formatNumber(row.percent ? value * 100 : value, row.percent ? 1 : 2);
}
function ec7SupportForceEnvelope(setResult) {
    const maximums = new Map();
    for (const phase of setResult?.phases ?? []) {
        if (phase?.converged === false)
            continue;
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
    if (!maximums.size)
        return "No converged support-force results";
    return [...maximums.entries()].map(([id, item]) => {
        const details = [`${formatNumber(item.force, 2)} kN/m`];
        if (item.axial !== undefined)
            details.push(`axial ${formatNumber(item.axial, 2)} kN/m`);
        if (item.moment !== undefined)
            details.push(`${formatNumber(item.moment, 2)} kNm/m`);
        return `${id}: ${details.join(" · ")} (${item.phase})`;
    }).join("; ");
}
export function buildEc7VerificationHtml(result) {
    const verification = result?.ec7_verification;
    if (!verification)
        return "";
    const sets = ["set1", "set2"].map((setName) => verification.sets?.find((item) => item?.set === setName) ?? null);
    const partialFactors = verification.partial_factors ?? {};
    const factorRows = EC7_FACTOR_DISPLAY_ROWS.map((row) => `
    <tr><th scope="row">${row.label}</th><td>${ec7FactorValue(partialFactors.set1, row)}</td><td>${ec7FactorValue(partialFactors.set2, row)}</td></tr>
  `).join("");
    const summaryRows = sets.map((setResult, index) => {
        const governing = setResult?.governing ?? {};
        const setNumber = index + 1;
        const allConverged = setResult?.converged === true && (setResult?.phases ?? []).every((phase) => phase?.converged !== false);
        return `<tr><th scope="row">Set ${setNumber}</th><td>${formatNumber(governing.max_abs_moment_kNm_per_m ?? 0, 2)} kNm/m (${escapeHtml(governing.max_abs_moment_phase ?? "n/a")})</td><td>${formatNumber(governing.max_abs_shear_kN_per_m ?? 0, 2)} kN/m (${escapeHtml(governing.max_abs_shear_phase ?? "n/a")})</td><td>${escapeHtml(ec7SupportForceEnvelope(setResult))}</td><td>${allConverged ? "All phases converged" : "One or more phases did not converge"}</td></tr>`;
    }).join("");
    const phaseNames = [...new Set(sets.flatMap((setResult) => (setResult?.overdig ?? []).map((item) => item.phase)))];
    const overdigRows = phaseNames.map((phaseName) => {
        const first = sets[0]?.overdig?.find((item) => item.phase === phaseName);
        const second = sets[1]?.overdig?.find((item) => item.phase === phaseName);
        const side = first?.side ?? second?.side ?? "—";
        const height = first?.height_m ?? second?.height_m;
        return `<tr><td>${escapeHtml(phaseName)}</td><td>${escapeHtml(side)}</td><td>${height === undefined ? "—" : formatNumber(height, 2)}</td><td>${first ? formatNumber(first.overdig_m ?? 0, 3) : "—"}</td><td>${second ? formatNumber(second.overdig_m ?? 0, 3) : "—"}</td></tr>`;
    }).join("");
    const failureAlerts = sets.flatMap((setResult, index) => (setResult?.phases ?? []).filter((phase) => phase?.converged === false).map((phase) => `<div class="phase-alert" role="alert"><strong>EC7 set ${index + 1}: phase &ldquo;${escapeHtml(phase.name ?? "n/a")}&rdquo; has no equilibrium &mdash; ULS verification fails</strong></div>`)).join("");
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
function buildResultViewToolbar(result, view) {
    if (!result?.ec7_verification)
        return "";
    return `<div class="result-view-toolbar"><label class="phase-control"><span>Results view</span><select class="phase-select" data-result-design-view aria-label="Results view"><option value="characteristic" ${view === "characteristic" ? "selected" : ""}>Characteristic (SLS)</option><option value="set1" ${view === "set1" ? "selected" : ""}>EC7 set 1</option><option value="set2" ${view === "set2" ? "selected" : ""}>EC7 set 2</option></select></label>${view === "characteristic" ? "" : `<p class="result-status">Moment and shear values are design values; displacements are unfactored.</p>`}</div>`;
}
export function buildResultHtml(result, phaseIndex, view = "characteristic") {
    const phase = resultPhaseForView(result, phaseIndex, view);
    const convergenceAlert = view === "characteristic" ? buildPhaseConvergenceAlert(result, phaseIndex) : "";
    const wallLengthSearch = result.search_evaluation;
    const plotData = buildPhasePlotData(result, phaseIndex, view);
    const { levels, displacement, rotation, moment, shear, pressure, waterPressure, source } = plotData;
    const steppedShear = buildSteppedShearSeries(result, phaseIndex, view === "characteristic" ? undefined : phase);
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
      ${buildSvgPlot(plot.levels ?? levels, plot.values, plot.color, view !== "characteristic" && (plot.color === "moment" || plot.color === "shear") ? `${plot.color === "moment" ? "Moment" : "Shear"} design value plot` : plot.label, plot.unit)}
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
    <details class="result-card result-card-wide result-details">
      <summary><h3>Solver discretization</h3></summary>
      <p>${escapeHtml(buildDiscretizationSummary(result))}</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Node</th><th>Level</th><th>Next element</th></tr>
          </thead>
          <tbody>${buildDiscretizationRows(result)}</tbody>
        </table>
      </div>
    </details>
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
    <details class="result-card result-card-wide result-details">
      <summary><h3>Sampled numerical output</h3></summary>
      <p>Depth-wise API response table used for the plots and report without client-side engineering recomputation.</p>
      <div class="table-shell">
        <table>
          <thead>
            <tr><th>Level</th><th>Depth</th><th>Disp.</th><th>Rot.</th><th>Moment</th><th>Shear</th><th>Net p</th><th>Water p</th><th>Branch</th><th>Left</th><th>Right</th></tr>
          </thead>
          <tbody>${buildSampledResultRows(phase)}</tbody>
        </table>
      </div>
    </details>
  `;
}
// ---------------------------------------------------------------------------
// v2: one-click examples, design summary card, study request call to action.
// Everything below only reads the API response; no mechanics are recomputed.
export const VALIDATION_PAGE_PATH = "validation.html";
export const VALIDATION_PAGE_URL = "https://retaining.easuys.com/validation.html";
export const STUDY_REQUEST_EMAIL = "info@easuys.be";
export const STUDY_REQUEST_SUBJECT = "Retaining wall study - request for a fixed-price offer";
export const ON_REQUEST_SENTENCE = "Sloping ground and strip loads (for example a crane platform or a neighbouring foundation) are available on request.";
function finiteNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function fmt(value, digits = 1) {
    const number = finiteNumber(value);
    return number === undefined ? "n/a" : number.toFixed(digits);
}
function splitGoverningPhase(value) {
    const text = String(value ?? "").trim();
    const match = /^(.*?)\s*\[set (\d)\]$/.exec(text);
    return match ? { phase: match[1], set: `set ${match[2]}` } : { phase: text, set: "" };
}
function phaseWithSet(value) {
    const { phase, set } = splitGoverningPhase(value);
    if (!phase)
        return "n/a";
    return set ? `EC7 ${set} · ${phase}` : phase;
}
function supportRoleLabel(type) {
    if (type === "anchor")
        return "Anchor";
    if (type === "strut")
        return "Prop";
    const text = typeof type === "string" && type ? supportTypeLabel(type) : "support";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function characteristicSupportMaximum(result, supportId) {
    let best;
    for (const phase of result?.phases ?? []) {
        if (phase?.converged === false)
            continue;
        for (const reaction of phase?.support_reactions ?? []) {
            if (String(reaction?.id) !== supportId)
                continue;
            const horizontal = Math.abs(Number(reaction?.reaction_kN_per_m ?? 0));
            if (!best || horizontal > best.horizontal) {
                const axial = finiteNumber(reaction?.axial_force_kN_per_m);
                best = { horizontal, axial: axial === undefined ? undefined : Math.abs(axial), phase: String(phase?.name ?? "n/a") };
            }
        }
    }
    return best;
}
export function wallSectionShortLabel(project) {
    const segment = project.wall_geometry.segments[0];
    if (project.wall_type === "steel_sheet_pile") {
        const section = segment?.steel_section;
        const libraryName = section?.library_section_id
            ? STEEL_SHEET_PILE_LIBRARY[section.library_section_id]?.section_name
            : "";
        const name = section?.section_name || libraryName || segment?.label || "Steel sheet pile";
        return `${name} · fy ${fmt(section?.steel_grade_mpa ?? 355, 0)} MPa`;
    }
    return segment?.label || "Diaphragm wall";
}
function ec7FactorsAreDefaults(partialFactors) {
    for (const setName of ["set1", "set2"]) {
        const defaults = EC7_PARTIAL_FACTOR_DEFAULTS[setName];
        for (const [key, value] of Object.entries(defaults)) {
            const used = Number(partialFactors?.[setName]?.[key] ?? value);
            if (Math.abs(used - value) > 1e-9)
                return false;
        }
    }
    return true;
}
function utilisationStatus(utilisation, pass) {
    if (utilisation !== undefined)
        return utilisation <= 1 + 1e-9 ? "pass" : "fail";
    if (pass === true)
        return "pass";
    if (pass === false)
        return "fail";
    return "not_assessed";
}
export function buildDesignSummary(project, result, caseTitle = "Retaining project") {
    const displayProject = resolveAnalyzedProject(project, result);
    const isSteel = displayProject.wall_type === "steel_sheet_pile";
    const verification = result?.ec7_verification;
    const wall = result?.design_checks?.wall;
    const serviceability = result?.design_checks?.serviceability;
    const supportChecks = Array.isArray(result?.design_checks?.supports) ? result.design_checks.supports : [];
    const governing = result?.governing ?? {};
    const wallLabel = wallSectionShortLabel(displayProject);
    const designWord = verification ? "Design" : "Max.";
    const valueKind = verification ? "design value" : "characteristic";
    const bendingSet = splitGoverningPhase(wall?.bending_governing_phase).set;
    const shearSet = splitGoverningPhase(wall?.shear_governing_phase).set;
    const ec7 = verification
        ? {
            active: true,
            label: "EC7-BE, design approach 1, sets 1 and 2",
            detail: [
                ec7FactorsAreDefaults(verification.partial_factors) ? "Default EC7-BE partial factors" : "Partial factors changed by the user",
                `overdig ${fmt(Number(verification.partial_factors?.set1?.overdig_fraction ?? 0.1) * 100, 0)} % of H, at most ${fmt(verification.partial_factors?.set1?.overdig_max_m ?? 0.5, 1)} m`,
                bendingSet || shearSet
                    ? `bending governed by ${bendingSet || "the characteristic analysis"}, shear by ${shearSet || "the characteristic analysis"}`
                    : "",
                "displacements are characteristic (SLS)",
            ].filter(Boolean).join("; ") + ".",
        }
        : {
            active: false,
            label: "Characteristic analysis only",
            detail: "No EC7 ultimate limit state verification. Set Design mode to EC7 for sets 1 and 2 with the EC7-BE factors.",
        };
    const figures = [];
    figures.push({
        id: "moment",
        label: `${designWord} bending moment${verification ? " M_Ed" : ""}`,
        value: `${fmt(wall?.bending_demand_kNm_per_m ?? governing.max_abs_moment_kNm_per_m, 0)} kNm/m`,
        detail: wall
            ? `${splitGoverningPhase(wall.bending_governing_phase).set ? `EC7 ${splitGoverningPhase(wall.bending_governing_phase).set}` : valueKind} · at ${fmt(wall.bending_governing_level_m, 1)} m`
            : `${valueKind} · ${governing.max_abs_moment_phase ?? "n/a"}`,
    });
    figures.push({
        id: "shear",
        label: `${designWord} shear force${verification ? " V_Ed" : ""}`,
        value: `${fmt(wall?.shear_demand_kN_per_m ?? governing.max_abs_shear_kN_per_m, 0)} kN/m`,
        detail: wall
            ? `${splitGoverningPhase(wall.shear_governing_phase).set ? `EC7 ${splitGoverningPhase(wall.shear_governing_phase).set}` : valueKind} · at ${fmt(wall.shear_governing_level_m, 1)} m`
            : `${valueKind} · ${governing.max_abs_shear_phase ?? "n/a"}`,
    });
    figures.push({
        id: "displacement",
        label: "Wall displacement (SLS)",
        value: `${fmt(serviceability?.max_abs_displacement_mm ?? governing.max_abs_displacement_mm, 1)} mm`,
        detail: `${finiteNumber(serviceability?.limit_mm) !== undefined ? `limit ${fmt(serviceability.limit_mm, 0)} mm · ` : ""}characteristic`,
    });
    const governingSupport = governingSupportCheck(result);
    if (governingSupport) {
        const role = supportRoleLabel(governingSupport.support_type);
        const designForce = finiteNumber(governingSupport.axial_demand_kN_per_m) ?? finiteNumber(governingSupport.demand_kN_per_m);
        const characteristic = characteristicSupportMaximum(result, String(governingSupport.support_id));
        const characteristicForce = characteristic ? (characteristic.axial ?? characteristic.horizontal) : undefined;
        figures.push({
            id: "support",
            label: `${role} force${verification ? " (design)" : ""}`,
            value: `${fmt(designForce, 0)} kN/m`,
            detail: [
                `${governingSupport.support_id}${finiteNumber(governingSupport.axial_demand_kN_per_m) !== undefined ? " · axial" : ""}`,
                splitGoverningPhase(governingSupport.governing_phase).set ? `EC7 ${splitGoverningPhase(governingSupport.governing_phase).set}` : "",
                characteristicForce !== undefined ? `characteristic ${fmt(characteristicForce, 0)} kN/m` : "",
            ].filter(Boolean).join(" · "),
        });
    }
    else {
        figures.push({ id: "support", label: "Anchor / prop force", value: "None", detail: "Cantilever wall: no anchors or props" });
    }
    const bendingUtilisation = finiteNumber(wall?.bending_utilization);
    const shearUtilisation = finiteNumber(wall?.shear_utilization);
    const maxUtilisation = bendingUtilisation === undefined && shearUtilisation === undefined
        ? undefined
        : Math.max(bendingUtilisation ?? 0, shearUtilisation ?? 0);
    figures.push({
        id: "utilisation",
        label: `${isSteel ? "Profile" : "Section"} utilisation`,
        value: maxUtilisation === undefined ? "n/a" : fmt(maxUtilisation, 2),
        detail: `bending ${fmt(bendingUtilisation, 2)} · shear ${fmt(shearUtilisation, 2)}`,
    });
    const checks = [];
    if (wall) {
        checks.push({
            id: "wall-bending",
            label: "Wall bending",
            basis: isSteel ? "EN 1993-5 5.2.2, M_Rd = W_pl f_y / γ_M0" : "Entered design moment resistance",
            demand: `${fmt(wall.bending_demand_kNm_per_m, 1)} kNm/m`,
            capacity: `${fmt(wall.bending_capacity_kNm_per_m, 1)} kNm/m`,
            utilisation: bendingUtilisation,
            status: utilisationStatus(bendingUtilisation, wall.pass),
            note: phaseWithSet(wall.bending_governing_phase),
        });
        checks.push({
            id: "wall-shear",
            label: "Wall shear",
            basis: isSteel ? "EN 1993-5 5.2.2, V_Rd = A_v f_y / (√3 γ_M0)" : "Entered design shear resistance",
            demand: `${fmt(wall.shear_demand_kN_per_m, 1)} kN/m`,
            capacity: `${fmt(wall.shear_capacity_kN_per_m, 1)} kN/m`,
            utilisation: shearUtilisation,
            status: utilisationStatus(shearUtilisation, wall.pass),
            note: phaseWithSet(wall.shear_governing_phase),
        });
    }
    for (const item of supportChecks) {
        const axial = finiteNumber(item?.axial_demand_kN_per_m) !== undefined && finiteNumber(item?.axial_capacity_kN_per_m) !== undefined;
        const utilisation = finiteNumber(item?.utilization_ratio);
        checks.push({
            id: `support-${item?.support_id}`,
            label: `${supportRoleLabel(item?.support_type)} ${item?.support_id ?? ""}`.trim(),
            basis: axial ? "Entered capacity, axial force" : "Entered capacity, horizontal force",
            demand: `${fmt(axial ? item.axial_demand_kN_per_m : item?.demand_kN_per_m, 1)} kN/m`,
            capacity: `${fmt(axial ? item.axial_capacity_kN_per_m : item?.capacity_kN_per_m, 1)} kN/m`,
            utilisation,
            status: item?.pass === true ? "pass" : item?.pass === false ? "fail" : utilisationStatus(utilisation, undefined),
            note: phaseWithSet(item?.governing_phase),
        });
    }
    const displacement = finiteNumber(serviceability?.max_abs_displacement_mm);
    const limit = finiteNumber(serviceability?.limit_mm);
    checks.push({
        id: "displacement",
        label: "Wall displacement",
        basis: "Project limit, characteristic analysis (SLS)",
        demand: `${fmt(displacement, 1)} mm`,
        capacity: limit === undefined ? "not declared" : `${fmt(limit, 1)} mm`,
        utilisation: displacement !== undefined && limit !== undefined && limit > 0 ? displacement / limit : undefined,
        status: serviceability?.assessed === true ? (serviceability.pass === true ? "pass" : "fail") : "not_assessed",
        note: String(governing.max_abs_displacement_phase ?? ""),
    });
    const failedStages = [];
    for (const phase of result?.phases ?? []) {
        if (phase?.converged === false)
            failedStages.push(`characteristic: ${phase.name}`);
    }
    for (const setResult of verification?.sets ?? []) {
        for (const phase of setResult?.phases ?? []) {
            if (phase?.converged === false)
                failedStages.push(`EC7 ${String(setResult.set ?? "").replace("set", "set ")}: ${phase.name}`);
        }
    }
    const stageCount = Array.isArray(result?.phases) ? result.phases.length : 0;
    checks.push({
        id: "equilibrium",
        label: "Equilibrium in every stage",
        basis: verification ? "Characteristic analysis and EC7 sets 1 and 2" : "Characteristic analysis",
        demand: `${stageCount} stage${stageCount === 1 ? "" : "s"}`,
        capacity: failedStages.length ? `${failedStages.length} without equilibrium` : "all converged",
        status: failedStages.length ? "fail" : stageCount ? "pass" : "not_assessed",
        note: failedStages.length
            ? `No equilibrium in ${failedStages.join("; ")}. Lengthen the wall or add support.`
            : "",
    });
    const overallPass = result?.design_checks?.overall_pass;
    const anyFail = checks.some((check) => check.status === "fail");
    const overall = overallPass === true && !anyFail ? "pass" : overallPass === false || anyFail ? "fail" : "not_assessed";
    return {
        caseTitle,
        wallLabel,
        ec7,
        figures,
        checks,
        overall,
        overallText: overall === "pass"
            ? "All assessed checks pass"
            : overall === "fail"
                ? "One or more checks fail"
                : "Checks not assessed",
    };
}
const SUMMARY_STATUS_LABEL = { pass: "✓ Pass", fail: "✗ Fail", not_assessed: "– Not assessed" };
export function buildStudyRequestMailto(summary) {
    const lines = [
        "Hello,",
        "",
        "I would like a fixed-price offer for a retaining wall study.",
        "",
        "Project location:",
        "Excavation depth and length:",
        "Neighbouring buildings, roads or loads:",
        "Soil investigation (CPT / borehole) available: yes / no",
        "Planned wall type:",
        "Timing:",
    ];
    if (summary) {
        lines.push("", `Screening result from the workspace (${summary.caseTitle}, not a design):`);
        for (const figure of summary.figures) {
            lines.push(`- ${figure.label}: ${figure.value} (${figure.detail})`);
        }
        lines.push(`- ${summary.ec7.label}: ${summary.overallText.toLowerCase()}`);
    }
    const subject = summary ? `${STUDY_REQUEST_SUBJECT} (${summary.caseTitle})` : STUDY_REQUEST_SUBJECT;
    return `mailto:${STUDY_REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
export function buildStudyCtaHtml(summary, options = {}) {
    const text = `<p class="study-cta-text"><strong>Need a design you can build from?</strong> EA Suys prepares the retaining wall study for your project, with soil parameters from your CPTs, every construction stage, the anchor or prop design and a calculation note. ${escapeHtml(ON_REQUEST_SENTENCE)}</p>`;
    if (options.forReport) {
        return `<div class="study-cta">${text}<p class="study-cta-text">Request a study or a fixed-price offer: ${escapeHtml(STUDY_REQUEST_EMAIL)}</p></div>`;
    }
    return `<div class="study-cta">${text}<a class="action-button study-cta-button" data-study-mailto href="${escapeHtml(buildStudyRequestMailto(summary))}">Request a study · fixed-price offer</a></div>`;
}
const SYMBOL_PATTERN = /(^|[\s(=/√])(M|V|W|f|A|γ)_(Ed|Rd|pl|y|v|M0)(?=$|[\s),/])/g;
/** Escapes the text and writes symbols such as M_Ed or γ_M0 with a subscript. */
export function withSubscripts(text) {
    return escapeHtml(text).replace(SYMBOL_PATTERN, (_match, before, symbol, index) => `${before}${symbol}<sub>${index}</sub>`);
}
export function buildDesignSummaryHtml(summary, options = {}) {
    const validationHref = options.forReport ? VALIDATION_PAGE_URL : VALIDATION_PAGE_PATH;
    const figures = summary.figures.map((figure) => `
      <div class="summary-figure summary-figure-${escapeHtml(figure.id)}">
        <span class="summary-figure-label">${withSubscripts(figure.label)}</span>
        <strong class="summary-figure-value">${escapeHtml(figure.value)}</strong>
        <span class="summary-figure-detail">${escapeHtml(figure.detail)}</span>
      </div>`).join("");
    const rows = summary.checks.map((check) => {
        const utilisation = check.utilisation === undefined ? "—" : fmt(check.utilisation, 2);
        const bar = check.utilisation === undefined
            ? ""
            : `<span class="util-bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, check.utilisation * 100)).toFixed(0)}%"></span></span>`;
        return `
        <tr class="summary-check summary-check-${check.status}" data-check="${escapeHtml(check.id)}">
          <th scope="row">${escapeHtml(check.label)}<span class="summary-check-basis">${withSubscripts(check.basis)}</span></th>
          <td>${escapeHtml(check.demand)}</td>
          <td>${escapeHtml(check.capacity)}</td>
          <td class="summary-util">${utilisation}${bar}</td>
          <td><span class="status-chip status-${check.status}">${SUMMARY_STATUS_LABEL[check.status]}</span>${check.note ? `<span class="summary-check-note">${escapeHtml(check.note)}</span>` : ""}</td>
        </tr>`;
    }).join("");
    return `
    <article class="design-summary design-summary-${summary.overall}" aria-labelledby="design-summary-title" data-design-summary-card>
      <header class="design-summary-head">
        <div>
          <p class="panel-kicker">Design summary</p>
          <h2 id="design-summary-title">${escapeHtml(summary.caseTitle)}</h2>
          <p class="design-summary-sub">${escapeHtml(summary.wallLabel)} · ${escapeHtml(summary.ec7.label)}</p>
        </div>
        <p class="summary-verdict status-${summary.overall}" data-summary-verdict>${escapeHtml(summary.overallText)}</p>
      </header>
      <div class="summary-figures">${figures}
      </div>
      <div class="table-shell">
        <table class="summary-checks">
          <thead><tr><th scope="col">Check</th><th scope="col">Demand</th><th scope="col">Resistance / limit</th><th scope="col">Utilisation</th><th scope="col">Status</th></tr></thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
      <p class="summary-ec7"><strong>EC7 set used:</strong> ${escapeHtml(summary.ec7.label)}. ${escapeHtml(summary.ec7.detail)}</p>
      <p class="summary-scope">Screening result, not a design release. Not covered here: overall and deep-seated stability, anchor length, vertical equilibrium, hydraulic failure (heave, piping) and corrosion allowance.</p>
      <p class="summary-evidence">How the engine is checked: comparisons with the published SPW 2006 examples, with the differences explained, on the <a href="${escapeHtml(validationHref)}" data-validation-link>validation page</a>.</p>
      ${buildStudyCtaHtml(summary, options)}
    </article>`;
}
function exampleThumbnailSvg(project) {
    const width = 150;
    const height = 104;
    const phase = project.phases[project.phases.length - 1];
    const top = project.wall_geometry.top_level_m;
    const toe = project.wall_geometry.toe_level_m;
    const bottomLevel = toe - 2;
    const y = (level) => 10 + ((top - level) / (top - bottomLevel)) * (height - 16);
    const wallX = 75;
    const leftGround = y(phase?.excavation_level_left_m ?? top);
    const rightGround = y(phase?.excavation_level_right_m ?? top);
    const waterLeft = Math.max(y(phase?.groundwater_level_left_m ?? bottomLevel), leftGround);
    const waterRight = Math.max(y(phase?.groundwater_level_right_m ?? bottomLevel), rightGround);
    const parts = [
        `<rect x="4" y="${leftGround.toFixed(1)}" width="${wallX - 4}" height="${(height - 4 - leftGround).toFixed(1)}" fill="#dcc6a6"></rect>`,
        `<rect x="${wallX}" y="${rightGround.toFixed(1)}" width="${width - 4 - wallX}" height="${(height - 4 - rightGround).toFixed(1)}" fill="#cfb08a"></rect>`,
        `<line x1="6" x2="${wallX - 2}" y1="${waterLeft.toFixed(1)}" y2="${waterLeft.toFixed(1)}" stroke="#2f8fda" stroke-width="1.5" stroke-dasharray="4 3"></line>`,
        `<line x1="${wallX + 2}" x2="${width - 6}" y1="${waterRight.toFixed(1)}" y2="${waterRight.toFixed(1)}" stroke="#2f8fda" stroke-width="1.5" stroke-dasharray="4 3"></line>`,
        project.wall_type === "diaphragm_wall"
            ? `<rect x="${wallX - 3}" y="${y(top).toFixed(1)}" width="6" height="${(y(toe) - y(top)).toFixed(1)}" fill="#7d8a90"></rect>`
            : `<line x1="${wallX}" x2="${wallX}" y1="${y(top).toFixed(1)}" y2="${y(toe).toFixed(1)}" stroke="#3a596a" stroke-width="3"></line>`,
    ];
    if ((phase?.surcharge_right_kPa ?? 0) > 0) {
        for (const x of [100, 116, 132]) {
            parts.push(`<line x1="${x}" x2="${x}" y1="${(rightGround - 9).toFixed(1)}" y2="${(rightGround - 2).toFixed(1)}" stroke="#9b2226" stroke-width="1.5"></line>`);
        }
    }
    for (const support of project.supports) {
        const sy = y(top - support.depth_m);
        if (support.type === "anchor") {
            const direction = support.side === "left" ? -1 : 1;
            const angle = ((support.inclination_degrees ?? 0) * Math.PI) / 180;
            const x2 = wallX + direction * 52 * Math.cos(angle);
            const y2 = sy + 52 * Math.sin(angle);
            parts.push(`<line x1="${wallX}" y1="${sy.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0b6e4f" stroke-width="2"></line>`);
            parts.push(`<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="4" fill="#0b6e4f"></circle>`);
        }
        else if (support.type === "strut") {
            // The API side is the direction of the prop force on the wall; the prop stands on the other side.
            const direction = support.side === "left" ? 1 : -1;
            parts.push(`<line x1="${wallX}" y1="${sy.toFixed(1)}" x2="${(wallX + direction * 62).toFixed(1)}" y2="${sy.toFixed(1)}" stroke="#8b5e00" stroke-width="3"></line>`);
        }
    }
    return `<svg class="example-thumb" viewBox="0 0 ${width} ${height}" role="img" aria-label="Sketch of the final stage">${parts.join("")}</svg>`;
}
export function buildExamplePresetsHtml(activeId) {
    return EXAMPLE_PRESETS.map((preset, index) => `
    <article class="example-card${preset.id === activeId ? " is-active" : ""}" data-example-card="${escapeHtml(preset.id)}">
      <div class="example-card-head">
        <div>
          <p class="panel-kicker">Example ${index + 1}</p>
          <h3>${escapeHtml(preset.title)}</h3>
          <p class="example-lede">${escapeHtml(preset.lede)}</p>
        </div>
        ${exampleThumbnailSvg(preset.project)}
      </div>
      <ul class="example-facts">${preset.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
      <button type="button" class="action-button example-run" data-example-preset="${escapeHtml(preset.id)}" aria-label="Run example: ${escapeHtml(preset.title)}">${preset.id === activeId ? "Run again" : "Run this example"}</button>
    </article>
  `).join("");
}
function buildInputTablesHtml(project) {
    const sameProfiles = JSON.stringify(project.soil_profiles.left.layers) === JSON.stringify(project.soil_profiles.right.layers);
    const layerRows = (side, layers) => layers.map((layer) => `<tr><td>${escapeHtml(side)}</td><td>${fmt(layer.top_level_m, 2)} to ${fmt(layer.bottom_level_m, 2)}</td><td>${fmt(layer.unit_weight_dry_kN_m3, 1)} / ${fmt(layer.unit_weight_wet_kN_m3, 1)}</td><td>${fmt(layer.friction_angle_deg, 1)}</td><td>${fmt(layer.cohesion_kPa ?? 0, 1)}</td><td>${fmt(layer.subgrade_modulus_kN_m3, 0)}</td></tr>`).join("");
    const soilRows = sameProfiles
        ? layerRows("Both sides", project.soil_profiles.left.layers)
        : `${layerRows("Left", project.soil_profiles.left.layers)}${layerRows("Right", project.soil_profiles.right.layers)}`;
    const phaseRows = project.phases.map((phase, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(phase.name)}</td><td>${fmt(phase.excavation_level_left_m, 2)} / ${fmt(phase.excavation_level_right_m, 2)}</td><td>${fmt(phase.groundwater_level_left_m, 2)} / ${fmt(phase.groundwater_level_right_m, 2)}</td><td>${fmt(phase.surcharge_left_kPa ?? 0, 1)} / ${fmt(phase.surcharge_right_kPa ?? 0, 1)}</td></tr>`).join("");
    const supportRows = project.supports.length
        ? project.supports.map((support) => `<tr><td>${escapeHtml(support.id)}</td><td>${escapeHtml(supportRoleLabel(support.type))}</td><td>${fmt(support.depth_m, 2)}</td><td>${fmt(support.inclination_degrees ?? 0, 0)}°</td><td>${support.stiffness_kN_per_m === undefined ? "—" : fmt(support.stiffness_kN_per_m, 0)}</td><td>${fmt(support.prestress_kN_per_m ?? 0, 0)}</td><td>${support.capacity_kN_per_m === undefined ? "—" : fmt(support.capacity_kN_per_m, 0)}</td><td>${(support.active_from_phase ?? 0) + 1}</td></tr>`).join("")
        : `<tr><td colspan="8">No anchors or props (cantilever wall).</td></tr>`;
    return [
        `<h3>Construction stages</h3>`,
        `<table><thead><tr><th>#</th><th>Stage</th><th>Excavation L / R (m)</th><th>Groundwater L / R (m)</th><th>Surcharge L / R (kPa)</th></tr></thead><tbody>${phaseRows}</tbody></table>`,
        `<h3>Soil layers</h3>`,
        `<table><thead><tr><th>Side</th><th>Level (m)</th><th>γ / γ<sub>sat</sub> (kN/m³)</th><th>φ′ (°)</th><th>c′ (kPa)</th><th>k<sub>h</sub> (kN/m³)</th></tr></thead><tbody>${soilRows}</tbody></table>`,
        `<h3>Anchors and props</h3>`,
        `<table><thead><tr><th>Id</th><th>Type</th><th>Depth (m)</th><th>Angle</th><th>Stiffness (kN/m/m)</th><th>Prestress (kN/m)</th><th>Capacity (kN/m)</th><th>From stage</th></tr></thead><tbody>${supportRows}</tbody></table>`,
    ].join("\n");
}
export function buildResultDownloadText(project, result) {
    const analyzedProject = resolveAnalyzedProject(project, result);
    const downloadableResult = structuredClone(result);
    if (downloadableResult?.ec7_verification) {
        downloadableResult.ec7_verification.procedure = "EC7-BE design approach 1, sets 1 and 2.";
        downloadableResult.assumptions = (downloadableResult.assumptions ?? []).filter((item) => !/^EC7 verification:|^The partial factors can be changed/.test(item));
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
export function buildResultFilename(project, date = new Date()) {
    const stamp = date.toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
    return `ea-suys-${normalizeFileSlug(project.wall_type)}-${project.design_mode}-${stamp}.json`;
}
export function buildReportFilename(project, date = new Date()) {
    return buildResultFilename(project, date).replace(/\.json$/, ".html");
}
export function buildReportPreviewHtml(project, result, phaseIndex) {
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
        <li>Max wall displacement (project limit): ${Number.isFinite(displayProject.design_options?.max_wall_displacement_mm) ? `${formatNumber(displayProject.design_options?.max_wall_displacement_mm, 2)} mm` : "not declared"}</li>
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
export function buildReportHtml(project, result, phaseIndex = 0, generatedAt = new Date(), resultView = "characteristic", caseTitle = "Retaining project") {
    const displayProject = resolveAnalyzedProject(project, result);
    const wallSection = buildWallSectionMetadata(displayProject);
    const phase = resultPhaseForView(result, phaseIndex, resultView);
    const summary = buildResultSummaryItems(result, phaseIndex);
    const supportItems = buildSupportReactionListItems(phase);
    const wallLengthSearch = result.search_evaluation;
    const plotData = buildPhasePlotData(result, phaseIndex, resultView);
    const { levels, displacement, rotation, moment, shear, pressure, waterPressure, source } = plotData;
    const designSummary = buildDesignSummary(project, result, caseTitle);
    const pad = (value) => String(value).padStart(2, "0");
    const readableDate = `${pad(generatedAt.getDate())}/${pad(generatedAt.getMonth() + 1)}/${generatedAt.getFullYear()} ${pad(generatedAt.getHours())}:${pad(generatedAt.getMinutes())}`;
    const viewLabel = resultView === "characteristic" ? "characteristic values" : `EC7 ${resultView.replace("set", "set ")} design values for moment and shear`;
    const figure = (title, quantity, svg) => [
        "    <article class=\"figure-card\">",
        `      <h3>${title}</h3>`,
        `      <p>${escapeHtml(plotSourceDescription(source, quantity))}</p>`,
        svg,
        "    </article>",
    ].join("\n");
    return [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        `  <title>EA Suys Retaining Wall Report · ${escapeHtml(caseTitle)}</title>`,
        "  <style>",
        "    @page { size: A4; margin: 14mm 12mm 16mm; }",
        "    * { box-sizing: border-box; }",
        "    body { max-width: 1000px; margin: 24px auto; padding: 0 18px; color: #182022; font: 14px/1.45 \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif; }",
        "    .report-header { display: flex; justify-content: space-between; align-items: end; gap: 16px; padding-bottom: 10px; border-bottom: 3px solid #0b6e4f; }",
        "    .report-brand { margin: 0; color: #0b6e4f; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; font-size: 12px; }",
        "    h1 { margin: 2px 0 4px; font-size: 22px; }",
        "    .report-case { margin: 0; font-size: 15px; font-weight: 600; }",
        "    .report-meta { margin: 0; color: #596265; font-size: 12px; text-align: right; }",
        "    .report-preview { margin: 10px 0 0; padding: 7px 10px; border-left: 4px solid #c5a04e; background: #fff4d8; color: #5a3a00; font-size: 12px; }",
        "    h2 { margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(24, 32, 34, 0.16); font-size: 15px; letter-spacing: 0.02em; color: #114f3d; }",
        "    h3 { margin: 14px 0 4px; font-size: 13px; }",
        "    dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px 14px; margin: 8px 0; }",
        "    dt { color: #596265; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }",
        "    dd { margin: 2px 0 0; font-weight: 600; }",
        "    ul { padding-left: 18px; }",
        "    .figure-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }",
        "    .figure-card { border: 1px solid rgba(24, 32, 34, 0.14); border-radius: 8px; padding: 8px; break-inside: avoid; }",
        "    .figure-card h3 { margin: 0 0 4px; font-size: 12px; }",
        "    .figure-card p { margin: 0 0 6px; color: #596265; font-size: 10px; }",
        "    .figure-card svg { width: 100%; height: auto; display: block; }",
        "    .figure-card-wide { grid-column: 1 / -1; }",
        "    .figure-card-wide svg { max-height: 420px; }",
        "    .geometry-legend { display: flex; flex-wrap: wrap; gap: 2px 12px; margin: 6px 0 0; padding: 0; list-style: none; color: #596265; font-size: 10px; }",
        "    .ec7-verification { margin-top: 14px; border: 1px solid rgba(24, 32, 34, 0.16); border-radius: 8px; padding: 10px 12px; }",
        "    .ec7-verification h3 { margin-top: 0; }",
        "    .phase-alert { margin: 10px 0; padding: 10px 12px; border: 1px solid #b42318; border-left-width: 5px; border-radius: 8px; background: #fdecea; color: #5c1411; }",
        "    .phase-alert strong { color: #8a1c14; }",
        "    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }",
        "    th, td { border-bottom: 1px solid rgba(24, 32, 34, 0.12); padding: 5px 6px; text-align: left; vertical-align: top; }",
        "    th { color: #596265; font-size: 11px; }",
        "    thead th { background: #f0eee7; color: #182022; }",
        "    tr { break-inside: avoid; }",
        "    .note { color: #596265; }",
        "    .design-summary { padding: 12px 14px; border: 1px solid rgba(24, 32, 34, 0.18); border-top: 5px solid #0b6e4f; border-radius: 8px; break-inside: avoid; }",
        "    .design-summary-fail { border-top-color: #b42318; }",
        "    .design-summary-head { display: flex; justify-content: space-between; align-items: start; gap: 12px; }",
        "    .design-summary-head h2 { margin: 0; padding: 0; border: 0; color: #182022; font-size: 16px; }",
        "    .panel-kicker { margin: 0; color: #596265; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }",
        "    .design-summary-sub { margin: 2px 0 0; color: #596265; font-size: 12px; }",
        "    .summary-verdict { margin: 0; padding: 5px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; white-space: nowrap; }",
        "    .summary-verdict.status-pass { background: #d7efe5; color: #114f3d; }",
        "    .summary-verdict.status-fail { background: #fdecea; color: #8a1c14; }",
        "    .summary-verdict.status-not_assessed { background: #f0eee7; color: #596265; }",
        "    .summary-figures { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin: 10px 0; }",
        "    .summary-figure { display: grid; align-content: start; gap: 1px; padding: 7px 8px; border: 1px solid rgba(24, 32, 34, 0.12); border-radius: 6px; background: #fbfaf6; }",
        "    .summary-figure-label { color: #596265; font-size: 10px; }",
        "    .summary-figure-value { font-size: 17px; }",
        "    .summary-figure-detail { color: #596265; font-size: 9.5px; line-height: 1.3; }",
        "    .summary-check-basis, .summary-check-note { display: block; color: #596265; font-size: 10px; font-weight: 400; }",
        "    .summary-checks th[scope=row] { color: #182022; font-size: 12px; }",
        "    .util-bar { display: block; width: 70px; height: 5px; margin-top: 3px; border-radius: 3px; background: #e6e3da; overflow: hidden; }",
        "    .util-bar span { display: block; height: 100%; background: #0b6e4f; }",
        "    .summary-check-fail .util-bar span { background: #b42318; }",
        "    .status-chip { font-weight: 700; white-space: nowrap; }",
        "    .status-chip.status-pass { color: #114f3d; }",
        "    .status-chip.status-fail { color: #8a1c14; }",
        "    .status-chip.status-not_assessed { color: #596265; }",
        "    .summary-ec7, .summary-scope, .summary-evidence { margin: 6px 0 0; font-size: 11.5px; }",
        "    .summary-scope { color: #596265; }",
        "    .study-cta { margin-top: 8px; padding: 8px 10px; border-radius: 6px; background: #eef6f2; }",
        "    .study-cta-text { margin: 0; font-size: 11.5px; }",
        "    .appendix h2 { color: #596265; }",
        "    .report-footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid rgba(24, 32, 34, 0.16); color: #596265; font-size: 11px; }",
        "    @media (max-width: 900px) { .figure-grid, .summary-figures, dl { grid-template-columns: repeat(2, minmax(0, 1fr)); } }",
        "    @media print {",
        "      body { max-width: none; margin: 0; padding: 0; font-size: 10pt; }",
        "      a { color: inherit; text-decoration: none; }",
        "      h2 { break-after: avoid; }",
        "      .report-figures, .appendix { break-before: page; }",
        "      .figure-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }",
        "      .figure-card-wide { grid-column: auto; }",
        "      .figure-card-wide svg { max-height: none; }",
        "      .figure-card > p { display: none; }",
        "      .summary-figures { grid-template-columns: repeat(5, minmax(0, 1fr)); }",
        "      dl { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
        "    }",
        "  </style>",
        "</head>",
        "<body>",
        "  <header class=\"report-header\">",
        "    <div>",
        "      <p class=\"report-brand\">EA Suys · Retaining workspace</p>",
        "      <h1>EA Suys Retaining Wall Report</h1>",
        `      <p class="report-case">${escapeHtml(caseTitle)} · ${escapeHtml(designSummary.wallLabel)}</p>`,
        "    </div>",
        `    <p class="report-meta">${escapeHtml(readableDate)}<br>Formula version ${escapeHtml(result.formula_version || "n/a")}<br>retaining.easuys.com</p>`,
        "  </header>",
        `  <p class="note">Generated ${escapeHtml(generatedAt.toISOString())}</p>`,
        "  <p class=\"report-preview\"><strong>Engineering preview.</strong> Screening output, not a design release. Independent engineering review and complete input checks remain required.</p>",
        "  <h2>1. Design summary</h2>",
        buildDesignSummaryHtml(designSummary, { forReport: true }),
        "  <h2>2. Input</h2>",
        `  <dl><div><dt>Wall type</dt><dd>${escapeHtml(displayProject.wall_type.replaceAll("_", " "))}</dd></div><div><dt>Design mode</dt><dd>${escapeHtml(displayProject.design_mode.toUpperCase())}</dd></div><div><dt>Selected phase</dt><dd>${escapeHtml(phase.name)}</dd></div><div><dt>Formula version</dt><dd>${escapeHtml(result.formula_version || "n/a")}</dd></div><div><dt>Wall inclination</dt><dd>${escapeHtml(formatNumber(displayProject.wall_geometry.inclination_degrees ?? 0, 1))}°</dd></div><div><dt>Vertical wall load</dt><dd>${escapeHtml(formatNumber(phase.normalized_vertical_line_load_kN_per_m ?? phase.vertical_line_load_kN_per_m ?? displayProject.phases[phaseIndex]?.vertical_line_load_kN_per_m ?? 0, 1))} kN/m</dd></div><div><dt>Target element length</dt><dd>${escapeHtml(formatNumber(targetElementLengthForProject(displayProject), 2))} m</dd></div><div><dt>Max wall displacement (project limit)</dt><dd>${Number.isFinite(displayProject.design_options?.max_wall_displacement_mm) ? `${escapeHtml(formatNumber(displayProject.design_options?.max_wall_displacement_mm, 2))} mm` : "Not declared"}</dd></div><div><dt>${escapeHtml(wallSection.label)}</dt><dd>${escapeHtml(wallSection.value)}</dd></div><div><dt>Toe control</dt><dd>${escapeHtml(wallLengthSearch ? `Search selected ${formatNumber(wallLengthSearch.selected_toe_level_m, 1)} m (${wallLengthSearch.stop_reason})` : `Fixed toe ${formatNumber(displayProject.wall_geometry.toe_level_m, 1)} m`)}</dd></div></dl>`,
        buildInputTablesHtml(displayProject),
        result?.ec7_verification ? buildEc7VerificationHtml(result) : "",
        "  <section class=\"report-figures\">",
        `  <h2>3. Figures · ${escapeHtml(phase.name)} (${escapeHtml(viewLabel)})</h2>`,
        "  <div class=\"figure-grid\">",
        "    <article class=\"figure-card figure-card-wide\">",
        "      <h3>Geometry Preview</h3>",
        "      <p>Selected phase geometry, excavation, groundwater, surface levels, and support layout.</p>",
        buildGeometryPreviewSvg(displayProject, phaseIndex),
        "    </article>",
        figure("Bending Moment Plot", "moment array", buildSvgPlot(levels, moment, "moment", "Moment plot", "kNm/m")),
        figure("Shear Plot", "shear array", buildSvgPlot(levels, shear, "shear", "Shear plot", "kN/m")),
        figure("Displacement Plot", "displacement array", buildSvgPlot(levels, displacement, "displacement", "Displacement plot", "mm")),
        figure("Net Pressure Plot", "net soil pressure array", buildSvgPlot(levels, pressure, "pressure", "Net pressure plot", "kPa")),
        figure("Water Pressure Plot", "water-pressure array", buildSvgPlot(levels, waterPressure, "water", "Water pressure plot", "kPa")),
        figure("Rotation Plot", "rotation array", buildSvgPlot(levels, rotation, "rotation", "Rotation plot", "mrad")),
        figure("Wall Deformed Shape", "displacement array", buildDeformedWallSvg(levels, displacement)),
        "  </div>",
        "  </section>",
        "  <h2>4. Wall design check</h2>",
        `  <table><thead><tr><th>Check field</th><th>Value</th></tr></thead><tbody>${buildWallCheckRows(result)}</tbody></table>`,
        "  <h2>5. Support design checks</h2>",
        `  <ul>${buildSupportCheckList(result)}</ul>`,
        `  <table><thead><tr><th>Support</th><th>Type</th><th>Demand</th><th>Capacity</th><th>Utilization</th><th>Governing phase</th><th>Status</th></tr></thead><tbody>${buildSupportCheckRows(result)}</tbody></table>`,
        "  <section class=\"appendix\">",
        "  <h2>Appendix A. Result lines</h2>",
        `  <ul>${summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
        "  <h2>Global Governing Envelope</h2>",
        `  <table><thead><tr><th>Quantity</th><th>Min</th><th>Max</th><th>Max |abs|</th><th>Min phase</th><th>Max phase</th><th>Abs phase</th></tr></thead><tbody>${buildGlobalGoverningRows(result)}</tbody></table>`,
        wallLengthSearch
            ? `  <h2>Wall-Length Search</h2>\n  <ul><li>Start toe: ${escapeHtml(formatNumber(wallLengthSearch.start_toe_level_m, 1))} m</li><li>Minimum toe: ${escapeHtml(formatNumber(wallLengthSearch.minimum_toe_level_m, 1))} m</li><li>Step: ${escapeHtml(formatNumber(wallLengthSearch.step_m, 2))} m</li><li>Target max head displacement: ${escapeHtml(formatNumber(wallLengthSearch.max_head_displacement_mm, 1))} mm</li><li>Selected toe: ${escapeHtml(formatNumber(wallLengthSearch.selected_toe_level_m, 1))} m</li><li>Achieved max head displacement: ${escapeHtml(formatNumber(wallLengthSearch.achieved_max_head_displacement_mm, 2))} mm</li><li>Stop reason: ${escapeHtml(wallLengthSearch.stop_reason)}</li></ul>`
            : "",
        "  <h2>Support reactions</h2>",
        `  <ul>${supportItems}</ul>`,
        `  <table><thead><tr><th>Support</th><th>Type</th><th>Side</th><th>Depth</th><th>Horizontal force</th><th>Moment</th><th>Axial force</th><th>Utilization / State</th></tr></thead><tbody>${buildSupportReactionRows(phase)}</tbody></table>`,
        "  <h2>Discretization</h2>",
        `  <p>${escapeHtml(buildDiscretizationSummary(result))}</p>`,
        `  <table><thead><tr><th>Node</th><th>Level</th><th>Next element</th></tr></thead><tbody>${buildDiscretizationRows(result)}</tbody></table>`,
        "  <h2>Sampled numerical output</h2>",
        `  <table><thead><tr><th>Level</th><th>Depth</th><th>Disp.</th><th>Rot.</th><th>Moment</th><th>Shear</th><th>Net p</th><th>Water p</th><th>Branch</th><th>Left</th><th>Right</th></tr></thead><tbody>${buildSampledResultRows(phase)}</tbody></table>`,
        "  <h2>Warnings</h2>",
        `  <ul>${readableWarnings(result.warnings).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
        "  <h2>Assumptions</h2>",
        `  <ul>${(result.ec7_verification ? ["See the EC7 verification section for partial factors, design effects and overdig."] : result.assumptions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
        "  <h2>Source refs</h2>",
        `  <ul>${(result.ec7_verification ? [] : result.source_refs || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None</li>"}</ul>`,
        "  </section>",
        `  <footer class="report-footer">EA Suys · ${escapeHtml(STUDY_REQUEST_EMAIL)} · Validation: ${escapeHtml(VALIDATION_PAGE_URL)} · Screening output of the EA Suys retaining workspace, not a design release.</footer>`,
        "</body>",
        "</html>",
    ].join("\n");
}
function readStoredContactState() {
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
    }
    catch {
        return {
            projectName: "",
            email: "",
            message: "",
            consent: false,
        };
    }
}
function persistContactState(state) {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}
export function buildDirectMailto(contact, result, phaseIndex = 0) {
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
export function buildContactPanelHtml(contactState, result, phaseIndex, statusText = "Ready.") {
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
export function loadTurnstileScript(documentRef = globalThis.document, runtimeRef = globalThis) {
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
        const existing = documentRef.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
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
function unavailableServiceMessage(status) {
    return `The calculation service is currently unavailable (HTTP ${status}). Your input is kept; you can download the JSON payload and try again later.`;
}
export async function runAnalysis(project, fetchImpl = fetch, apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")) {
    let response;
    try {
        response = await fetchImpl(`${apiBaseUrl}${ANALYSIS_ROUTE}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(buildAnalysisPayload(project)),
        });
    }
    catch {
        throw new Error(unavailableServiceMessage(0));
    }
    const status = Number.isFinite(response.status) ? response.status : response.ok ? 200 : 0;
    let body;
    try {
        body = await response.json();
    }
    catch {
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
export async function checkCalculationService(fetchImpl = fetch, apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")) {
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
    }
    catch {
        return false;
    }
    finally {
        clearTimeout(timeout);
    }
}
export function buildStudyRequestPayload(contactState, result, phaseIndex, turnstileToken = "", sourceUrl = globalThis.location?.href || "") {
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
export async function submitStudyRequest(payload, fetchImpl = fetch, apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "")) {
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
function triggerDownload(filename, text, type) {
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
function updateInputPreview(project, preview, geometry, phaseIndex) {
    preview.innerHTML = buildInputSnapshot(project, phaseIndex).map((card) => `
    <article class="snapshot-card">
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
    geometry.innerHTML = buildGeometryPreviewSvg(project, phaseIndex);
}
function updateWorkspacePhaseSelect(project, select, phaseIndex) {
    select.innerHTML = buildProjectPhaseOptions(project).map((option) => `
    <option value="${option.index}" ${option.index === phaseIndex ? "selected" : ""}>${escapeHtml(option.label)}</option>
  `).join("");
}
function resultPhaseIndexForProject(project, result, projectPhaseIndex) {
    const projectPhase = project.phases[projectPhaseIndex];
    if (!projectPhase || !Array.isArray(result?.phases)) {
        return -1;
    }
    const matchingPhase = result.phases.findIndex((phase, index) => phase?.name === projectPhase.name || (phase?.phase_index ?? index) === projectPhaseIndex);
    return matchingPhase;
}
function renderContactPanel(shell, contactState, result, phaseIndex, onPersist) {
    shell.innerHTML = buildContactPanelHtml(contactState, result, phaseIndex);
    const status = shell.querySelector("[data-contact-status]");
    const form = shell.querySelector("[data-contact-form]");
    const projectInput = shell.querySelector("[data-contact-project]");
    const emailInput = shell.querySelector("[data-contact-email]");
    const messageInput = shell.querySelector("[data-contact-message]");
    const consentInput = shell.querySelector("[data-contact-consent]");
    const fallbackLink = shell.querySelector("[data-contact-fallback]");
    const turnstileTarget = shell.querySelector("[data-contact-turnstile]");
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
            callback: (token) => {
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
        const payload = buildStudyRequestPayload({
            projectName: projectInput.value,
            email: emailInput.value,
            message: messageInput.value,
            consent: consentInput.checked,
        }, result, phaseIndex, turnstileState.token);
        try {
            const body = await submitStudyRequest(payload);
            status.textContent = "Enquiry prepared. Opening mail client...";
            globalThis.location.href = body.mailto || fallbackLink.href;
        }
        catch (error) {
            status.textContent = error instanceof Error ? error.message : "Unable to prepare the enquiry.";
        }
    });
}
export function printReportDocument(reportHtml, onError = () => { }, documentRef = document) {
    const frame = documentRef.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    frame.className = "print-frame";
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    frame.addEventListener("load", () => {
        const frameWindow = frame.contentWindow;
        if (!frameWindow) {
            onError();
            frame.remove();
            return;
        }
        frameWindow.addEventListener("afterprint", () => setTimeout(() => frame.remove(), 0), { once: true });
        try {
            frameWindow.focus();
            frameWindow.print();
        }
        catch {
            onError();
            frame.remove();
        }
    }, { once: true });
    frame.srcdoc = reportHtml;
    documentRef.body.appendChild(frame);
    return frame;
}
function bootApp() {
    const input = document.querySelector("[data-project-input]");
    const quickEditor = document.querySelector("[data-quick-editor]");
    const runButton = document.querySelector("[data-run-analysis]");
    const preview = document.querySelector("[data-input-preview]");
    const geometry = document.querySelector("[data-geometry-preview]");
    const previewPhase = document.querySelector("[data-preview-phase]");
    const resultPlots = document.querySelector("[data-result-plots]");
    const emptyPlots = document.querySelector("[data-empty-plots]");
    const demoLabel = document.querySelector("[data-demo-label]");
    const serviceStatus = document.querySelector("[data-service-status]");
    const downloadInputButton = document.querySelector("[data-download-input]");
    const resultShell = document.querySelector("[data-result-shell]");
    const reportShell = document.querySelector("[data-report-shell]");
    const contactShell = document.querySelector("[data-contact-shell]");
    const phaseSelect = document.querySelector("[data-phase-select]");
    const status = document.querySelector("[data-status]");
    const downloadJsonButton = document.querySelector("[data-download-json]");
    const downloadHtmlButton = document.querySelector("[data-download-html]");
    const printButton = document.querySelector("[data-print-report]");
    if (!input ||
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
        !printButton) {
        return;
    }
    const examplesShell = document.querySelector("[data-example-presets]");
    const designSummaryShell = document.querySelector("[data-design-summary]");
    const apiBaseUrl = resolveApiBaseUrl(globalThis.location?.search ?? "");
    const demoEnabled = new URLSearchParams(globalThis.location?.search ?? "").get("demo") === "1";
    const requestedExample = demoEnabled
        ? undefined
        : examplePresetById(new URLSearchParams(globalThis.location?.search ?? "").get("example"));
    void checkCalculationService(fetch, apiBaseUrl).then((online) => {
        serviceStatus.textContent = online ? "Service online" : "Service offline";
        serviceStatus.classList.toggle("is-online", online);
        serviceStatus.classList.toggle("is-offline", !online);
    });
    let currentProject = structuredClone(requestedExample?.project ?? SAMPLE_PROJECT);
    let activePresetId = requestedExample?.id ?? null;
    let presetEdited = false;
    const caseTitle = () => {
        const preset = examplePresetById(activePresetId);
        return preset ? `${preset.title}${presetEdited ? " (edited)" : ""}` : "Retaining project";
    };
    const markEdited = () => {
        if (activePresetId && !presetEdited) {
            presetEdited = true;
            renderExamples();
        }
    };
    let currentResult = demoEnabled ? structuredClone(DEMO_RESULT ?? SAMPLE_RESULT) : null;
    let currentPreviewPhaseIndex = demoEnabled ? Math.min(2, currentProject.phases.length - 1) : 0;
    let currentResultPhaseIndex = 0;
    let currentResultDesignView = "characteristic";
    let currentEditorTabId = "general";
    let currentContactState = readStoredContactState();
    let currentEditorFocus = {
        segmentIndex: 0,
        leftLayerIndex: 0,
        rightLayerIndex: 0,
        supportIndex: 0,
    };
    const renderPreview = (rebuildEditor = true) => {
        currentEditorFocus = normalizeEditorFocus(currentProject, currentEditorFocus);
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
        const tabs = Array.from(quickEditor.querySelectorAll("[role='tab']"));
        const activateTab = (selectedTab) => {
            currentEditorTabId = selectedTab.dataset.editorTab ?? "general";
            tabs.forEach((tab) => {
                const active = tab === selectedTab;
                tab.setAttribute("aria-selected", String(active));
                tab.tabIndex = active ? 0 : -1;
                const panel = quickEditor.querySelector(`#${tab.getAttribute("aria-controls")}`);
                if (panel) {
                    panel.hidden = !active;
                }
            });
        };
        const selectTab = (tab) => {
            const leavingJson = currentEditorTabId === "json" && tab.dataset.editorTab !== "json";
            currentEditorTabId = tab.dataset.editorTab ?? "general";
            if (leavingJson) {
                renderPreview();
                return;
            }
            activateTab(tab);
        };
        tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => selectTab(tab));
            tab.addEventListener("keydown", (event) => {
                const keyEvent = event;
                let nextIndex = index;
                if (keyEvent.key === "ArrowRight") {
                    nextIndex = (index + 1) % tabs.length;
                }
                else if (keyEvent.key === "ArrowLeft") {
                    nextIndex = (index - 1 + tabs.length) % tabs.length;
                }
                else if (keyEvent.key === "Home") {
                    nextIndex = 0;
                }
                else if (keyEvent.key === "End") {
                    nextIndex = tabs.length - 1;
                }
                else {
                    return;
                }
                keyEvent.preventDefault();
                const targetTabId = tabs[nextIndex].dataset.editorTab;
                selectTab(tabs[nextIndex]);
                quickEditor.querySelector(`[data-editor-tab="${targetTabId}"]`)?.focus();
            });
        });
        activateTab(tabs.find((tab) => tab.dataset.editorTab === currentEditorTabId) ?? tabs[0]);
        quickEditor.querySelectorAll("[data-qe-structure-action]").forEach((button) => {
            button.addEventListener("click", () => {
                const action = button.dataset.qeStructureAction;
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
                markEdited();
                renderPreview();
                if (currentResult) {
                    status.textContent = "Structured editor changed the payload. Rerun the analysis to refresh results.";
                }
            });
        });
        quickEditor.querySelector("[data-qe-ec7-reset]")?.addEventListener("click", () => {
            currentProject = resetEc7PartialFactors(currentProject);
            input.value = formatJson(currentProject);
            markEdited();
            currentEditorTabId = "general";
            renderPreview();
            if (currentResult) {
                status.textContent = "EC7 partial factors reset to defaults. Rerun the analysis to refresh results.";
            }
        });
        quickEditor.querySelectorAll("input, select").forEach((field) => {
            field.addEventListener("change", () => {
                if (field.matches("[data-qe-segment-index]") ||
                    field.matches("[data-qe-left-layer-index]") ||
                    field.matches("[data-qe-right-layer-index]") ||
                    field.matches("[data-qe-support-index]")) {
                    currentEditorFocus = normalizeEditorFocus(currentProject, {
                        segmentIndex: Number(quickEditor.querySelector("[data-qe-segment-index]")?.value ?? 0),
                        leftLayerIndex: Number(quickEditor.querySelector("[data-qe-left-layer-index]")?.value ?? 0),
                        rightLayerIndex: Number(quickEditor.querySelector("[data-qe-right-layer-index]")?.value ?? 0),
                        supportIndex: Number(quickEditor.querySelector("[data-qe-support-index]")?.value ?? 0),
                    });
                    renderPreview();
                    if (currentResult) {
                        status.textContent = "Structured editor focus changed. Rerun the analysis after editing to refresh results.";
                    }
                    return;
                }
                const editorPatch = {
                    phase_name: quickEditor.querySelector("[data-qe-phase-name]")?.value,
                    wall_type: quickEditor.querySelector("[data-qe-wall-type]")?.value,
                    design_mode: quickEditor.querySelector("[data-qe-design-mode]")?.value,
                    ec7_partial_factors: readEc7FactorInputs(quickEditor),
                    toe_mode: quickEditor.querySelector("[data-qe-toe-mode]")?.value,
                    top_level_m: Number(quickEditor.querySelector("[data-qe-top-level]")?.value),
                    toe_level_m: Number(quickEditor.querySelector("[data-qe-toe-level]")?.value),
                    search_start_toe_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-search-start]")?.value),
                    search_minimum_toe_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-search-minimum]")?.value),
                    search_step_m: numberOrUndefined(quickEditor.querySelector("[data-qe-search-step]")?.value),
                    search_max_head_displacement_mm: numberOrUndefined(quickEditor.querySelector("[data-qe-search-max-disp]")?.value),
                    target_element_length_m: numberOrUndefined(quickEditor.querySelector("[data-qe-target-element-length]")?.value),
                    max_wall_displacement_mm: numberOrUndefined(quickEditor.querySelector("[data-qe-max-wall-displacement]")?.value),
                    segment_label: quickEditor.querySelector("[data-qe-segment-label]")?.value,
                    segment_top_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-top]")?.value),
                    segment_bottom_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-bottom]")?.value),
                    inclination_degrees: Number(quickEditor.querySelector("[data-qe-inclination]")?.value),
                    segment_ei_kNm2_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-ei]")?.value),
                    segment_cracked_ei_kNm2_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-cracked-ei]")?.value),
                    segment_cracking_moment_kNm_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-cracking-moment]")?.value),
                    segment_moment_resistance_kNm_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-mr]")?.value),
                    segment_shear_resistance_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-segment-vr]")?.value),
                    library_section_id: quickEditor.querySelector("[data-qe-library]")?.value,
                    section_name: quickEditor.querySelector("[data-qe-section-name]")?.value,
                    plastic_section_modulus_cm3_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-wpl]")?.value),
                    shear_area_cm2_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-av]")?.value),
                    steel_grade_mpa: numberOrUndefined(quickEditor.querySelector("[data-qe-fy]")?.value),
                    gamma_m0: numberOrUndefined(quickEditor.querySelector("[data-qe-gamma-m0]")?.value),
                    surface_level_left_m: numberOrUndefined(quickEditor.querySelector("[data-qe-surface-left]")?.value),
                    surface_level_right_m: numberOrUndefined(quickEditor.querySelector("[data-qe-surface-right]")?.value),
                    excavation_level_left_m: numberOrUndefined(quickEditor.querySelector("[data-qe-exc-left]")?.value),
                    excavation_level_right_m: numberOrUndefined(quickEditor.querySelector("[data-qe-exc-right]")?.value),
                    groundwater_level_left_m: numberOrUndefined(quickEditor.querySelector("[data-qe-gw-left]")?.value),
                    groundwater_level_right_m: numberOrUndefined(quickEditor.querySelector("[data-qe-gw-right]")?.value),
                    surcharge_left_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-sur-left]")?.value),
                    surcharge_right_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-sur-right]")?.value),
                    surcharge_left_action: quickEditor.querySelector("[data-qe-surcharge-left-action]")?.value,
                    surcharge_right_action: quickEditor.querySelector("[data-qe-surcharge-right-action]")?.value,
                    vertical_line_load_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-vertical-load]")?.value),
                    vertical_line_load_action: quickEditor.querySelector("[data-qe-vertical-line-load-action]")?.value,
                    include_vertical_line_second_order: (quickEditor.querySelector("[data-qe-second-order]")?.value === "true"),
                    left_top_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-left-top]")?.value),
                    left_bottom_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-left-bottom]")?.value),
                    left_unit_weight_dry_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-left-gamma-dry]")?.value),
                    left_unit_weight_wet_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-left-gamma-wet]")?.value),
                    left_friction_angle_deg: numberOrUndefined(quickEditor.querySelector("[data-qe-left-phi]")?.value),
                    left_cohesion_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-left-cohesion]")?.value),
                    left_wall_friction_deg: numberOrUndefined(quickEditor.querySelector("[data-qe-left-wall-friction]")?.value),
                    left_at_rest_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-left-k0]")?.value),
                    left_active_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-left-ka]")?.value),
                    left_passive_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-left-kp]")?.value),
                    left_bedding_model: quickEditor.querySelector("[data-qe-left-bedding-model]")?.value,
                    left_tri_linear_displacement_breakpoints_mm: numberOrUndefined(quickEditor.querySelector("[data-qe-left-breakpoint-1]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-left-breakpoint-2]")?.value) !== undefined
                        ? [
                            numberOrUndefined(quickEditor.querySelector("[data-qe-left-breakpoint-1]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-left-breakpoint-2]")?.value),
                        ]
                        : undefined,
                    left_tri_linear_stiffness_factors: numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-1]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-2]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-3]")?.value) !== undefined
                        ? [
                            numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-1]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-2]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-left-factor-3]")?.value),
                        ]
                        : undefined,
                    left_subgrade_modulus_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-left-ks]")?.value),
                    left_pore_pressure_offset_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-left-pore]")?.value),
                    right_top_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-right-top]")?.value),
                    right_bottom_level_m: numberOrUndefined(quickEditor.querySelector("[data-qe-right-bottom]")?.value),
                    right_unit_weight_dry_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-right-gamma-dry]")?.value),
                    right_unit_weight_wet_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-right-gamma-wet]")?.value),
                    right_friction_angle_deg: numberOrUndefined(quickEditor.querySelector("[data-qe-right-phi]")?.value),
                    right_cohesion_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-right-cohesion]")?.value),
                    right_wall_friction_deg: numberOrUndefined(quickEditor.querySelector("[data-qe-right-wall-friction]")?.value),
                    right_at_rest_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-right-k0]")?.value),
                    right_active_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-right-ka]")?.value),
                    right_passive_coefficient: numberOrUndefined(quickEditor.querySelector("[data-qe-right-kp]")?.value),
                    right_bedding_model: quickEditor.querySelector("[data-qe-right-bedding-model]")?.value,
                    right_tri_linear_displacement_breakpoints_mm: numberOrUndefined(quickEditor.querySelector("[data-qe-right-breakpoint-1]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-right-breakpoint-2]")?.value) !== undefined
                        ? [
                            numberOrUndefined(quickEditor.querySelector("[data-qe-right-breakpoint-1]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-right-breakpoint-2]")?.value),
                        ]
                        : undefined,
                    right_tri_linear_stiffness_factors: numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-1]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-2]")?.value) !== undefined &&
                        numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-3]")?.value) !== undefined
                        ? [
                            numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-1]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-2]")?.value),
                            numberOrUndefined(quickEditor.querySelector("[data-qe-right-factor-3]")?.value),
                        ]
                        : undefined,
                    right_subgrade_modulus_kN_m3: numberOrUndefined(quickEditor.querySelector("[data-qe-right-ks]")?.value),
                    right_pore_pressure_offset_kPa: numberOrUndefined(quickEditor.querySelector("[data-qe-right-pore]")?.value),
                    support_id: quickEditor.querySelector("[data-qe-support-id]")?.value,
                    support_type: quickEditor.querySelector("[data-qe-support-type]")?.value,
                    support_side: quickEditor.querySelector("[data-qe-support-side]")?.value,
                    support_depth_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-depth]")?.value),
                    support_active_from_phase: numberOrUndefined(quickEditor.querySelector("[data-qe-support-active-from]")?.value),
                    support_active_to_phase: (quickEditor.querySelector("[data-qe-support-active-to]")?.value === "")
                        ? null
                        : numberOrUndefined(quickEditor.querySelector("[data-qe-support-active-to]")?.value),
                    support_inclination_degrees: numberOrUndefined(quickEditor.querySelector("[data-qe-support-inclination]")?.value),
                    support_stiffness_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-stiffness]")?.value),
                    support_prestress_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-prestress]")?.value),
                    support_capacity_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-capacity]")?.value),
                    support_force_kN_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-force]")?.value),
                    support_moment_kNm_per_m: numberOrUndefined(quickEditor.querySelector("[data-qe-support-moment]")?.value),
                    support_action_type: quickEditor.querySelector("[data-qe-support-action-type]")?.value,
                    anchor_inclination_degrees: numberOrUndefined(quickEditor.querySelector("[data-qe-anchor-inclination]")?.value),
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
                currentProject = applyQuickEditorPatch(currentProject, currentPreviewPhaseIndex, reconcileQuickEditorEventPatch(changedField, editorPatch), currentEditorFocus);
                input.value = formatJson(currentProject);
                markEdited();
                renderPreview();
                if (currentResult) {
                    status.textContent = "Quick editor updated the payload. Rerun the analysis to refresh results.";
                }
            });
        });
    };
    const renderDesignSummary = () => {
        const summary = currentResult ? buildDesignSummary(currentProject, currentResult, caseTitle()) : null;
        if (designSummaryShell) {
            designSummaryShell.hidden = !summary;
            designSummaryShell.innerHTML = summary ? buildDesignSummaryHtml(summary) : "";
        }
        document.querySelectorAll("[data-study-mailto]").forEach((link) => {
            link.href = buildStudyRequestMailto(summary);
        });
    };
    const renderExamples = () => {
        if (!examplesShell)
            return;
        examplesShell.innerHTML = buildExamplePresetsHtml(presetEdited ? null : activePresetId);
        examplesShell.querySelectorAll("[data-example-preset]").forEach((button) => {
            button.addEventListener("click", () => {
                void loadAndRunExample(button.dataset.examplePreset ?? "");
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
            renderDesignSummary();
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
        resultPlots.querySelector("[data-result-design-view]")?.addEventListener("change", (event) => {
            const selected = event.currentTarget.value;
            currentResultDesignView = selected === "set1" || selected === "set2" ? selected : "characteristic";
            renderResults();
        });
        reportShell.innerHTML = buildReportPreviewHtml(currentProject, currentResult, currentResultPhaseIndex);
        renderDesignSummary();
        renderContactPanel(contactShell, currentContactState, currentResult, currentResultPhaseIndex, (nextState) => {
            currentContactState = nextState;
            persistContactState(currentContactState);
        });
    };
    input.value = formatJson(currentProject);
    renderExamples();
    renderPreview();
    renderResults();
    if (demoEnabled) {
        status.textContent = "Demo result — not a calculation.";
    }
    input.addEventListener("input", () => {
        try {
            currentProject = JSON.parse(input.value);
            markEdited();
            currentPreviewPhaseIndex = Math.min(currentPreviewPhaseIndex, Math.max(0, currentProject.phases.length - 1));
            currentEditorFocus = normalizeEditorFocus(currentProject, currentEditorFocus);
            renderPreview(false);
            status.textContent = currentResult
                ? "Payload parsed. Rerun the analysis to refresh results."
                : "Payload parsed. Ready to run.";
            status.classList.remove("status-error");
        }
        catch {
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
    const runCurrentProject = async () => {
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
            return true;
        }
        catch (error) {
            status.textContent = error instanceof Error ? error.message : "Analysis failed.";
            status.classList.add("status-error");
            return false;
        }
    };
    const loadAndRunExample = async (presetId) => {
        const preset = examplePresetById(presetId);
        if (!preset)
            return;
        activePresetId = preset.id;
        presetEdited = false;
        currentProject = structuredClone(preset.project);
        currentResult = null;
        currentPreviewPhaseIndex = currentProject.phases.length - 1;
        currentEditorFocus = normalizeEditorFocus(currentProject, { segmentIndex: 0, leftLayerIndex: 0, rightLayerIndex: 0, supportIndex: 0 });
        input.value = formatJson(currentProject);
        renderExamples();
        renderPreview();
        renderResults();
        status.textContent = `Running example: ${preset.title}...`;
        if (await runCurrentProject()) {
            designSummaryShell?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
    runButton.addEventListener("click", () => {
        void runCurrentProject();
    });
    downloadInputButton.addEventListener("click", () => {
        triggerDownload(buildResultFilename(currentProject).replace(/\.json$/, "-input.json"), input.value, "application/json");
    });
    downloadJsonButton.addEventListener("click", () => {
        if (!currentResult) {
            return;
        }
        const analyzedProject = resolveAnalyzedProject(currentProject, currentResult);
        triggerDownload(buildResultFilename(analyzedProject), buildResultDownloadText(currentProject, currentResult), "application/json");
    });
    downloadHtmlButton.addEventListener("click", () => {
        if (!currentResult) {
            return;
        }
        const analyzedProject = resolveAnalyzedProject(currentProject, currentResult);
        triggerDownload(buildReportFilename(analyzedProject), buildReportHtml(currentProject, currentResult, currentResultPhaseIndex, new Date(), currentResultDesignView, caseTitle()), "text/html;charset=utf-8");
    });
    printButton.addEventListener("click", () => {
        if (!currentResult) {
            return;
        }
        // window.open with "noopener" returns null, so the report is printed from a hidden frame.
        printReportDocument(buildReportHtml(currentProject, currentResult, currentResultPhaseIndex, new Date(), currentResultDesignView, caseTitle()), () => {
            status.textContent = "Unable to open the print dialog. Use Download HTML report and print that file.";
            status.classList.add("status-error");
        });
    });
}
if (typeof document !== "undefined") {
    bootApp();
}
