import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Filter } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/styles/theme";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {theme} = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;
  

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (category: string | null) => {
    onSelectCategory(category);
    toggleDropdown();
  };

  return (
    <View style={[styles.container , { backgroundColor: colors.background , shadowColor: colors.shadowColor }]}>
      <TouchableOpacity style={styles.header} onPress={toggleDropdown}>
        <Filter size={18} color={colors.textSecondary} />
        <Text style={[styles.headerText , { color: colors.textSecondary }]}>
          {selectedCategory || "All Categories"}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedCategory === null && styles.optionSelected,
            ]}
            onPress={() => handleSelect(null)}
          >
            <Text
              style={[
                [styles.optionText, { color: colors.text }],
                selectedCategory === null && styles.optionTextSelected,
              ]}
            >
              All Categories
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.option,
                selectedCategory === category && styles.optionSelected,
              ]}
              onPress={() => handleSelect(category)}
            >
              <Text
                style={[
                  [styles.optionText, { color: colors.text }],
                    
                  selectedCategory === category && styles.optionTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#333",
  },
  dropdown: {
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  optionSelected: {
    backgroundColor: "#f0f4ff",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#333",
  },
  optionTextSelected: {
    color: "#3B82F6",
    fontFamily: "Inter-SemiBold",
  },
});

export default CategoryFilter;
