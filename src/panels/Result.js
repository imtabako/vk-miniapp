import React from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Panel, PanelHeader, Button, Header, div } from '@vkontakte/vkui';

const Result=({Result, go})=> (
	<Panel id={Result}>
		<PanelHeader>
			Результаты
		</PanelHeader>
			<div>
			<Button stretched mode="secondary" size='l' onClick={go} data-to="home">Вернуться назад</Button>
			</div>
			<div>
			<Button stretched mode="secondary" size='l' onClick={go} data-to="spisok">Показать не засчитанных пользователей</Button>
			</div>
	</Panel>
);

Result.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Result;
