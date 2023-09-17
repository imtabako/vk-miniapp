import React, { useState, useEffect } from 'react';
import PropTypes, { elementType } from 'prop-types';
import {
	Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Checkbox, FormLayout, FormItem, Input,
	FormLayoutGroup, ChipsInput, Chip, Select, Text
} from '@vkontakte/vkui';

const Home = ({ Home, go,
	setPollUrl, handlePoll,					// Poll
	onChangeOption, _chstates,
											// 1. deleted
	sexFilter, onChangeSex,					// 2. sex
	age, onChangeAge, ageFilter,			// 3. age
											// 4. bots and shady
	groups, groupsFilter, onChangeGroup,	// 5. groups
	citiesFilter							// 6. cities
}) => (
	<Panel id={Home}>
		<PanelHeader>Проверка опросов</PanelHeader>
		<Group>
			<Header>
				<Div>
					<Text weight="1">Важно!</Text>
					<Text>Вы должны состоять сами в сообществе, голосование которого вы проверяете!</Text>
				</Div>
			</Header>
		</Group>
		<Group>
			<FormLayout>
				{/* Poll input, Poll main button */}
				<FormLayoutGroup mode="vertical">
					<FormItem>
						<Input
							id="pollInput"
							type="url"
							placeholder="https://vk.com/wall-142120544_3"
							onChange={(e) => setPollUrl(e.target.value)}
						/>
					</FormItem>
					<FormItem>
						<Button size='l' stretched onClick={handlePoll}>
							Проверить
						</Button>
					</FormItem>
				</FormLayoutGroup>
			</FormLayout>
			{/* Debug button, delete it later */}
			<Button size='l' stretched onClick={_chstates}>Check</Button>
		</Group>
		<Group>
			<Header>
				<Div>
					<Text weight="1" size="l">Опции</Text>
				</Div>
			</Header>
			{/* Options */}
			<FormLayout>
				<Header>
					{/* 1. Deleted filter */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='deletedFilter' onChange={onChangeOption}>
							Не засчитывать голоса удаленных пользователей.
						</Checkbox>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 2. Sex filter, sex Select */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='sexFilter' onChange={onChangeOption}>
							Засчитывать только:
						</Checkbox>
						<FormItem>
							<Select id='sex'
								// value={sex}
								disabled={!sexFilter}
								placeholder='Женщин'	// doesn't do anything
								onChange={onChangeSex}
								options={[
									{ label: 'Женщин', value: 'female' },
									{ label: 'Мужчин', value: 'male' },
								]}
							/>
						</FormItem>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 3. Age filter, age Input */}
					<FormLayoutGroup mode="horizontal" >
						<Checkbox id='ageFilter' onChange={onChangeOption}>
							Засчитывать пользователей возрастом старше:
						</Checkbox>
						<FormItem>
							<Input id='age'
								value={age}
								disabled={!ageFilter}
								type='number'
								placeholder="18" after="лет"	// placeholder doesn't do anything
								onChange={onChangeAge}
							/>
						</FormItem>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 4. Bots and shady filter */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='botsFilter' onChange={onChangeOption}>
							Не засчитывать страницы ботов и левые страницы.
						</Checkbox>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 5. Groups filter, groups ChipsInput */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='groupsFilter' onChange={onChangeOption}>
							Проверять на вступление в группу:
						</Checkbox>
						<FormItem>
							<ChipsInput id='groups'
								value={groups}
								disabled={!groupsFilter}
								placeholder="Название или ссылка"
								onChange={onChangeGroup}
								// onInputChange={() => console.log(groups)}	// suggest group in a dropdown box
								renderChip={({ value, label, option: { src }, ...rest }) => (
									<Chip
										value={value}
										before={<Avatar size={20} src={src} role="presentation" />}
										{...rest}
									>
										{label}
									</Chip>
								)}
							/>
						</FormItem>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 6. Cities filter, cities ChipsInput */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='citiesFilter' onChange={onChangeOption}>
							Засчитывать только пользователей из города(ов):
						</Checkbox>
						<FormItem>
							<ChipsInput id='cities'
								disabled={!citiesFilter}
								placeholder="Санкт-Петербург"
							// onChange={onCityInputChange}
							/>
						</FormItem>
					</FormLayoutGroup>
				</Header>
			</FormLayout>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired
};
	/*

	// options
	onChangeOption: PropTypes.func.isRequired,
	_chstates: PropTypes.func.isRequired,
	// deleted
	deletedFilter: PropTypes.bool.isRequired,
	// sex
	sex: PropTypes.string.isRequired,
	onChangeSex: PropTypes.func.isRequired,
	sexFilter: PropTypes.bool.isRequired,
	// age
	age: PropTypes.number.isRequired,
	onChangeAge: PropTypes.func.isRequired,
	ageFilter: PropTypes.bool.isRequired,
	// groups
	groups: PropTypes.array.isRequired,
	onChangeGroup: PropTypes.func.isRequired,
	onInputChangeGroup: PropTypes.func.isRequired,
	//city

	// func
	pollUrl: PropTypes.string.isRequired,
	setPollUrl: PropTypes.func.isRequired,
	handlePoll: PropTypes.func.isRequired
	
	*/

export default Home;
