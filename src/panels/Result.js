import React from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Panel, PanelHeader, Button, Group, Header, div, Div, Text } from '@vkontakte/vkui';

const Result=({Result, go, poll, answers})=> (
	<Panel id={Result}>
		<PanelHeader>Результаты</PanelHeader>
		{ poll != null &&
		<Group>
			<Div>
				<Header mode="primary" size="large">{poll.question}</Header>
				<Header mode="secondary">Данные голосования на {poll.date}</Header>
			</Div>
			{answers.map((e, i) =>
				<Div key={i}>
					<Text>{e.answer.text}</Text>
					<Div>
						<Text>
							Проголосовавших {e.answer.votes} из них {e.uncountedVotes} не подходят требованиям
							Итого: {e.answer.votes - e.uncountedVotes}
						</Text>
					</Div>
				</Div>
			)}
			<Div>
				<Text>Всего проголосовало {poll.votes} человек из них подходят требованиям {poll.votes - poll.uncountedVotes} человек.</Text>
			</Div>
		</Group>
		}
		<Group>
			<div>
				<Button stretched mode="secondary" size='l' onClick={go} data-to="home">Вернуться назад</Button>
			</div>
			<div>
				<Button stretched mode="secondary" size='l' onClick={go} data-to="list">Показать не засчитанных пользователей</Button>
			</div>
		</Group>
	</Panel>
);

Result.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Result;
