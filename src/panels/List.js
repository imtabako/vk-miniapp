import React from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Panel, PanelHeader, Button } from '@vkontakte/vkui';

const List=({List, go})=> (
	<Panel id={List}>
		<PanelHeader>
			Не засчитанные пользователи
		</PanelHeader>
		<div>
		<Button stretched mode="secondary" size='l' onClick={go} data-to="result">Вернуться назад</Button>
		</div>
	</Panel>
);

List.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default List;
