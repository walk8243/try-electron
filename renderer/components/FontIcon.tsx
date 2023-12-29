import { useContext } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FontIcon = ({
	icon,
	color,
}: {
	icon: IconDefinition;
	color?: { light: string; dark: string };
}) => {
	const mode = useContext(ColorModeContext);

	return <FontAwesomeIcon icon={icon} color={color?.[mode]} />;
};
