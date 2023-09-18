import React from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Panel, PanelHeader, Text, Button, Group, Link, Div } from '@vkontakte/vkui';

const List=({List, go, poll, list, reasons})=> (
	<Panel id={List}>
		<PanelHeader>Не засчитанные пользователи</PanelHeader>
		<Group>
			{list.map( (o, i) => 
				<Div key={i}>
					<Text>{poll.answers[i].text}</Text>
					{o.map( (e, j) =>
						<Div key={j}>
							<Link href={'https://vk.com/' + e.screen_name}>{e.first_name} {e.last_name} ( https://vk.com/{e.screen_name} ) - {reasons[e.reason]}</Link>
							<br></br>
						</Div>
					)}
				</Div>
			)}
		</Group>
		<Group>
			<div>
				<Button stretched mode="secondary" size='l' onClick={go} data-to="result">Вернуться назад</Button>
			</div>
		</Group>
	</Panel>
);

List.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default List;
