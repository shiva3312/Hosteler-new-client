//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Transgender = 'Transgender',
  Other = 'Other',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Disabled = 'disabled',
  Banned = 'banned',
}

export enum MealStatus {
  Active = 'active',
  Inactive = 'inactive',
  Disabled = 'disabled',
}

export enum ScheduleStatus {
  Ideal = 'ideal',
  Inprogress = 'inprogress',
  Pending = 'pending',
  Failed = 'failed',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

// Schedule Type Enum
export enum ScheduleType {
  BreakfastChart = 'meal_breakfast_chart',
  LunchChart = 'meal_lunch_chart',
  DinnerChart = 'meal_dinner_chart',
  SnackChart = 'meal_snack_chart',
}

export enum MessStatus {
  Open = 'Open',
  Closed = 'Closed',
  UnderMaintenance = 'Under Maintenance',
  Renovation = 'Renovation',
  TemporarilyClosed = 'Temporarily Closed',
  PermanentlyClosed = 'Permanently Closed',
  NotAvailable = 'Not Available',
  ComingSoon = 'Coming Soon',
}

export enum MenuCategory {
  Regular = 'Regular',
  Special = 'Special',
  Seasonal = 'Seasonal',
  Festive = 'Festive',
  Custom = 'Custom',
}

// Unit Enum
export enum Unit {
  Gram = 'gram_gm',
  Kilogram = 'kilogram_kg',
  Milligram = 'milligram_mg',
  Milliliter = 'milliliter_ml',
  Liter = 'liter_l',
  Cup = 'cup_cup',
  Teaspoon = 'teaspoon_tsp',
  Tablespoon = 'tablespoon_tbsp',
  Piece = 'piece_pcs',
  Slice = 'slice_slice',
  Unit = 'unit_unit',
  Packet = 'packet_pkt',
  Can = 'can_can',
  Bottle = 'bottle_btl',
  Box = 'box_box',
  Serving = 'serving_serving',
  Plate = 'plate_plate',
  Bowl = 'bowl_bowl',
  Loaf = 'loaf_loaf',
  Bar = 'bar_bar',
  Scoop = 'scoop_scoop',
}

export enum MenuType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
}

export enum MealType {
  Vegetarian = 'Vegetarian',
  NonVegetarian = 'Non-Vegetarian',
  Vegan = 'Vegan',
  Eggetarian = 'Eggetarian',
  AllEater = 'All Eater', // No restrictions
}

export enum MealCategory {
  Dal = 'Dal', // Options: Urad Dal, Masoor Dal, Tadka Dal, Moong Dal, Chana Dal, Panchmel Dal, Dal Makhani, Toor Dal
  GravyVeg = 'Gravy Veg', // Options: Paneer Butter Masala, Shahi Paneer, Kadai Paneer, Malai Kofta, Mix Veg Curry, Baingan Bharta, Bhindi Masala
  DryVeg = 'Dry Veg', // Options: Aloo Gobi, Aloo Matar, Bhindi Fry, Baingan Fry, Cabbage Sabzi, Tindora Fry, Capsicum Masala
  Bread = 'Bread', // Options: Roti, Naan, Paratha, Kulcha, Tandoori Roti, Missi Roti, Bhature, Poori
  Rice = 'Rice', // Options: Jeera Rice, Plain Rice, Pulao, Biryani, Fried Rice, Lemon Rice, Curd Rice, Coconut Rice
  Salad = 'Salad', // Options: Green Salad, Sprouts Salad, Cucumber Salad, Fruit Salad, Russian Salad, Caesar Salad
  Dessert = 'Dessert', // Options: Gulab Jamun, Jalebi, Rasgulla, Kheer, Halwa, Ice Cream, Brownie, Cheesecake
  Beverage = 'Beverage', // Options: Tea, Coffee, Lassi, Juice, Milkshake, Smoothie, Coconut Water, Lemonade
  Snack = 'Snack', // Options: Samosa, Pakora, Kachori, Dhokla, Aloo Tikki, Chaat, Spring Rolls, Nachos
  Soup = 'Soup', // Options: Tomato Soup, Sweet Corn Soup, Manchow Soup, Hot and Sour Soup, Lentil Soup, Cream of Mushroom Soup
  Appetizer = 'Appetizer', // Options: Paneer Tikka, Veg Seekh Kebab, Hara Bhara Kebab, Spring Rolls, Garlic Bread, Bruschetta
  Pickle = 'Pickle', // Options: Mango Pickle, Lemon Pickle, Mixed Vegetable Pickle, Chilli Pickle, Garlic Pickle
  Chutney = 'Chutney', // Options: Mint Chutney, Tamarind Chutney, Coconut Chutney, Tomato Chutney, Coriander Chutney
  Raita = 'Raita', // Options: Boondi Raita, Cucumber Raita, Onion Raita, Mint Raita, Pineapple Raita
  Curry = 'Curry', // Options: Chicken Curry, Mutton Curry, Fish Curry, Egg Curry, Prawn Curry, Vegetable Curry
  StirFry = 'Stir Fry', // Options: Stir-Fried Vegetables, Stir-Fried Noodles, Stir-Fried Tofu, Stir-Fried Paneer
  Stew = 'Stew', // Options: Vegetable Stew, Chicken Stew, Mutton Stew, Lentil Stew, Coconut Milk Stew
  Other = 'Other', // Options: Any other dish not listed above
}

export enum BreakfastCategory {
  Cereal = 'Cereal', // Options: Cornflakes, Muesli, Oats, Granola
  Porridge = 'Porridge', // Options: Rice Porridge, Oats Porridge, Millet Porridge
  Bread = 'Bread', // Options: Toast, Bagel, Croissant, Baguette
  Pancake = 'Pancake', // Options: Classic Pancake, Blueberry Pancake, Banana Pancake
  Waffle = 'Waffle', // Options: Classic Waffle, Chocolate Waffle, Belgian Waffle
  EggDish = 'Egg Dish', // Options: Scrambled Eggs, Omelette, Boiled Eggs, Poached Eggs, Egg Bhurji
  Sandwich = 'Sandwich', // Options: Veg Sandwich, Grilled Sandwich, Club Sandwich, Cheese Sandwich
  Paratha = 'Paratha', // Options: Aloo Paratha, Paneer Paratha, Gobi Paratha, Methi Paratha
  Idli = 'Idli', // Options: Plain Idli, Rava Idli, Masala Idli
  Dosa = 'Dosa', // Options: Plain Dosa, Masala Dosa, Rava Dosa, Onion Dosa
  Upma = 'Upma', // Options: Rava Upma, Vegetable Upma, Semiya Upma
  Poha = 'Poha', // Options: Kanda Poha, Batata Poha, Indori Poha
  Beverage = 'Beverage', // Options: Tea, Coffee, Juice, Milkshake, Smoothie
  Fruit = 'Fruit', // Options: Banana, Apple, Orange, Papaya, Watermelon
  Yogurt = 'Yogurt', // Options: Plain Yogurt, Flavored Yogurt, Greek Yogurt
  Smoothie = 'Smoothie', // Options: Banana Smoothie, Berry Smoothie, Mango Smoothie
  Other = 'Other', // Options: Any other breakfast item not listed above
}

export enum SnackCategory {
  Chips = 'Chips', // Options: Potato Chips, Banana Chips, Tortilla Chips
  Samosa = 'Samosa', // Options: Aloo Samosa, Paneer Samosa, Keema Samosa
  Pakora = 'Pakora', // Options: Onion Pakora, Paneer Pakora, Aloo Pakora, Palak Pakora
  Sandwich = 'Sandwich', // Options: Veg Sandwich, Cheese Sandwich, Grilled Sandwich
  Burger = 'Burger', // Options: Veg Burger, Cheese Burger, Chicken Burger
  Pizza = 'Pizza', // Options: Margherita Pizza, Veggie Pizza, Pepperoni Pizza
  Wrap = 'Wrap', // Options: Veg Wrap, Paneer Wrap, Chicken Wrap
  Chaat = 'Chaat', // Options: Pani Puri, Bhel Puri, Sev Puri, Dahi Puri
  Fries = 'Fries', // Options: French Fries, Masala Fries, Sweet Potato Fries
  Nuts = 'Nuts', // Options: Almonds, Cashews, Peanuts, Walnuts
  Popcorn = 'Popcorn', // Options: Salted Popcorn, Butter Popcorn, Caramel Popcorn
  Cookies = 'Cookies', // Options: Chocolate Chip Cookies, Oatmeal Cookies, Butter Cookies
  Cake = 'Cake', // Options: Chocolate Cake, Vanilla Cake, Red Velvet Cake
  Pastry = 'Pastry', // Options: Chocolate Pastry, Pineapple Pastry, Black Forest Pastry
  Beverage = 'Beverage', // Options: Tea, Coffee, Juice, Milkshake
  Other = 'Other', // Options: Any other snack item not listed above
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

// Blood Group Enum
export enum BloodGroup {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
}

// Device Type Enum
export enum DeviceType {
  Phone = 'Phone',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
  Laptop = 'Laptop',
  SmartTV = 'Smart TV',
  Wearable = 'Wearable',
  GameConsole = 'Game Console',
  Other = 'Other',
}

export enum ImageSize {
  Icon = 'icon', // smaller 100x100
  // Thumbnail = 'thumbnail', // small 150x150
  Small = 'small', // medium 300x300
  Medium = 'medium', // large 600x600
  Original = 'original', // original size
  Large = 'large', // extra large 1200x1200
}

export enum TempRequestType {
  TempLink = 'TempLink',
  LoginAttempt = 'LoginAttempt',
  ResetPassword = 'ResetPassword',
}
