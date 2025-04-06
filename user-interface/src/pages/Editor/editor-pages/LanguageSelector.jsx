import {
    Box,
    Button,
    Text,
} from "@chakra-ui/react";

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";

import { LANGUAGE_VERSIONS } from "../constants.jsx";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect  }) => {
  return (
    <Box ml={2} mb={4} >
      <Text mb={2} fontSize="lg" gap={10}>
        Language:
      </Text>
      <Menu isLazy>
        <MenuButton colorPalette="grey"
                    variant="surface" padding={2} as={Button}>{language}</MenuButton>
        <MenuList bg="#110c1b" padding={2}>
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : "grey"}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: "grey.200",
              }}
              padding={2}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
export default LanguageSelector;
