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
			{answers.map( (e, i) =>
				<div key={i}>
					<Text>{e.answer.text}</Text>
					<Div id={"div-parent-" + i} style={{
						'display': 'flex',
						'flex-direction': 'column',
						'align-items': 'center',
						'text-align': 'center'
						}
					}>
						<Div id={"div-row-" + i} style={{position: 'relative', display: 'flex', width: '100%'}}>
							<Div id={"div-left-" + i} style={{width: e.answer.votes/poll.votes*100 + '%', height: '50px', backgroundColor: "#DCE1E7"}}>
								<Div style={{position: 'absolute', left: '25%'}}>
								<Text style={{color: '#000000'}}>
									Проголосовавших {e.answer.votes} из них {e.uncountedVotes} не подходят требованиям
									<br></br>
									Итого: {e.answer.votes - e.uncountedVotes}
								</Text>
								</Div>
							</Div>
							<Div id={"div-right-" + i} style={{width: 100 - e.answer.votes/poll.votes*100 + '%', height: '50px', backgroundColor: "#F3F4F8"}}>
							</Div>
						</Div>
					</Div>
				</div>
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
				<Button stretched mode="secondary" size='l' onClick={go} data-to="list">Показать незасчитанных пользователей</Button>
			</div>
		</Group>
	</Panel>
);

Result.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Result;
