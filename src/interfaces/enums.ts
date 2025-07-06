//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum Religion {
  Hinduism = 'Hinduism',
  Islam = 'Islam',
  Christianity = 'Christianity',
  Sikhism = 'Sikhism',
  Buddhism = 'Buddhism',
  Jainism = 'Jainism',
  Zoroastrianism = 'Zoroastrianism',
  Judaism = 'Judaism',
  Bahai = "Bahá'í Faith",
  Tribal = 'Tribal Religion',
  Animism = 'Animism',
  Sarnaism = 'Sarnaism',
  Lingayatism = 'Lingayatism',
  Ayyavazhi = 'Ayyavazhi',
  Sanamahism = 'Sanamahism',
  Tengrianism = 'Tengrianism',
  Kirant = 'Kirant',
  Cheondogyo = 'Cheondogyo',
  DonyiPolo = 'Donyi-Polo',
  Other = 'Other',
}

export enum CasteCategory {
  General = 'General',
  OBC = 'Other Backward Class (OBC)',
  OBC_NCL = 'Other Backward Class - Non-Creamy Layer (OBC-NCL)',
  OBC_CL = 'Other Backward Class - Creamy Layer (OBC-CL)',
  SC = 'Scheduled Caste (SC)',
  ST = 'Scheduled Tribe (ST)',
  EWS = 'Economically Weaker Section (EWS)',
  NT = 'Nomadic Tribes (NT)',
  DNT = 'Denotified Tribes (DNT)',
  SBC = 'Special Backward Class (SBC)',
  VJNT = 'Vimukta Jati and Nomadic Tribes (VJNT)',
  Other = 'Other',
}

export enum AddressType {
  Permanent = 'Permanent',
  Current = 'Current',
  Residential = 'Residential',
  Home = 'Home',
  Office = 'Office',
  Mailing = 'Mailing',
  Billing = 'Billing',
  Shipping = 'Shipping',
  Temporary = 'Temporary',
  Hostel = 'Hostel',
  College = 'College',
  University = 'University',
  Workplace = 'Workplace',
  Rented = 'Rented',
  Native = 'Native Place',
  Other = 'Other',
}

export enum FoodPreference {
  Veg = 'Vegetarian', // No meat, only plant-based food.
  NonVeg = 'Non-Vegetarian', // Includes meat, poultry, fish, etc.
  Vegan = 'Vegan', // No animal products (no dairy, eggs, honey).
  Pescatarian = 'Pescatarian', // Vegetarian + Fish & Seafood.
  Eggetarian = 'Eggetarian', // Vegetarian + Eggs.
  LactoVegetarian = 'Lacto-Vegetarian', // Veg + Dairy, No Eggs.
  OvoVegetarian = 'Ovo-Vegetarian', // Veg + Eggs, No Dairy.
  Flexitarian = 'Flexitarian', // Mostly veg, occasionally meat.
  Paleo = 'Paleo', // Meat, fish, vegetables, nuts (no grains, dairy, processed food).
  Keto = 'Keto', // Low-carb, high-fat diet.
  Halal = 'Halal', // Islamic dietary laws.
  Kosher = 'Kosher', // Jewish dietary laws.
  Jain = 'Jain', // No root vegetables, follows Jainism dietary restrictions.
  RawVegan = 'Raw Vegan', // Only uncooked plant-based food.
  Fruitarian = 'Fruitarian', // Mostly fruits, some nuts, seeds.
  GlutenFree = 'Gluten-Free', // No wheat, barley, rye, etc.
  DairyFree = 'Dairy-Free', // No milk, cheese, butter, etc.
  NutFree = 'Nut-Free', // No peanuts, tree nuts, etc.
  SeafoodFree = 'Seafood-Free', // No fish or shellfish.
  SoyFree = 'Soy-Free', // No soy-based products.
  AllEater = 'No Preference', // Eats everything, no restrictions.
  Other = 'Other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum DeviceType {
  PHONE = 'Phone',
  TABLET = 'Tablet',
  DESKTOP = 'Desktop',
  LAPTOP = 'Laptop',
  SMART_TV = 'Smart TV',
  WEARABLE = 'Wearable',
  GAME_CONSOLE = 'Game Console',
  OTHER = 'Other',
}
