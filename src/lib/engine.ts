export interface Coordinate {
  x: number; // -1 to 1 (West to East)
  y: number; // -1 to 1 (North to South, let's use standard math where North is positive Y, so 1 is North, -1 is South)
}

export interface PoleDistances {
  north: number; // Distance to (0, 1)
  south: number; // Distance to (0, -1)
  east: number;  // Distance to (1, 0)
  west: number;  // Distance to (-1, 0)
  center: number; // Distance to (0, 0)
}

export interface DataMatrix {
  authoritarianism: number; // Center
  supranationalism: number; // North
  communitarianism: number; // South
  nationalism: number;      // East
  anarchism: number;        // West
  
  // Complex indicators
  surveillance: number;
  bureaucraticOversight: number;
  marketDeregulation: number;
  socialConservatism: number;
  wealthRedistribution: number;
  militaryIntervention: number;
  personalPrivacy: number;
  religiousInfluence: number;
  borderControl: number;
  environmentalRegulation: number;
}

export class CentripetalEngine {
  private static MAX_RADIUS = 1.0; // Since coordinates are -1 to 1, max distance to a vertex from center is 1

  // Calculate distances to all key points
  public static calculateDistances(coord: Coordinate): PoleDistances {
    const dist = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    return {
      center: dist(coord.x, coord.y, 0, 0),
      north: dist(coord.x, coord.y, 0, 1),
      south: dist(coord.x, coord.y, 0, -1),
      east: dist(coord.x, coord.y, 1, 0),
      west: dist(coord.x, coord.y, -1, 0),
    };
  }

  // Value from 0 to 100 based on inverse distance (closer = higher value)
  private static inverseDistanceValue(distance: number, maxDist: number = 2.0): number {
    const normalized = Math.max(0, Math.min(1, distance / maxDist));
    return 100 - (normalized * 100);
  }

  // Calculate all metrics based on probe coordinate
  public static calculateMatrix(coord: Coordinate): DataMatrix {
    const distances = this.calculateDistances(coord);
    
    // Core Poles (Inverse radial)
    // Center is max radius 1.0 from boundary
    const authoritarianism = this.inverseDistanceValue(distances.center, 1.0); 
    
    // Other poles are max distance 2.0 away from opposite pole
    const supranationalism = this.inverseDistanceValue(distances.north, 2.0);
    const communitarianism = this.inverseDistanceValue(distances.south, 2.0);
    const nationalism = this.inverseDistanceValue(distances.east, 2.0);
    const anarchism = this.inverseDistanceValue(distances.west, 2.0);

    // Complex Indicators (Mathematical pull)
    // Surveillance: High when close to Center AND North Pole (Authoritarian Globalism)
    const surveillance = (authoritarianism * 0.6) + (supranationalism * 0.4);
    
    // Bureaucratic Oversight: High near Center, slightly pulled by North
    const bureaucraticOversight = (authoritarianism * 0.7) + (supranationalism * 0.3);

    // Market Deregulation: Pulled heavily by Anarchism (West) and slightly by Nationalism (East) depending on context, let's say West
    const marketDeregulation = (anarchism * 0.8) + (nationalism * 0.2);

    // Social Conservatism: Pulled by Communitarianism (South) and Nationalism (East)
    const socialConservatism = (communitarianism * 0.5) + (nationalism * 0.5);

    // Wealth Redistribution: Pulled by Supranationalism (North) and Communitarianism (South)? 
    // Usually more central/supranational. Let's make it North + Center.
    const wealthRedistribution = (supranationalism * 0.5) + (authoritarianism * 0.5);

    // Military Intervention: High near Nationalism (East) and Center
    const militaryIntervention = (nationalism * 0.6) + (authoritarianism * 0.4);

    // Personal Privacy: Purely inversely proportional to Authoritarianism, max at Perimeter
    const personalPrivacy = 100 - authoritarianism;

    // Religious Influence: Pulled by South (Communitarianism) and East (Nationalism)
    const religiousInfluence = (communitarianism * 0.6) + (nationalism * 0.4);

    // Border Control: Pulled strictly by Nationalism (East) and Center
    const borderControl = (nationalism * 0.7) + (authoritarianism * 0.3);

    // Environmental Regulation: Pulled by North (Supranationalism) and Center
    const environmentalRegulation = (supranationalism * 0.7) + (authoritarianism * 0.3);

    return {
      authoritarianism,
      supranationalism,
      communitarianism,
      nationalism,
      anarchism,
      surveillance,
      bureaucraticOversight,
      marketDeregulation,
      socialConservatism,
      wealthRedistribution,
      militaryIntervention,
      personalPrivacy,
      religiousInfluence,
      borderControl,
      environmentalRegulation
    };
  }
}
