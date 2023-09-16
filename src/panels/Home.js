import React, { useState, useEffect } from 'react';
import PropTypes, { elementType } from 'prop-types';
import {
	Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Checkbox, FormLayout, FormItem, Input,
	FormLayoutGroup, ChipsInput, Chip, Select, Text
} from '@vkontakte/vkui';

const Home = ({ Home, go,
	deletedFilter, onChangeDeletedFilter,
	age, onChangeAge, ageFilter, onChangeAgeFilter,
	sex, onChangeSex, sexFilter, onChangeSexFilter,
	groups, onChangeGroup, onInputChangeGroup,
	pollUrl, setPollUrl, handlePollUrlChange
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
						<Button size='l' stretched onClick={handlePollUrlChange}>
							Проверить
						</Button>
					</FormItem>
				</FormLayoutGroup>
			</FormLayout>
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
						<Checkbox id='deletedFilter' onChange={onChangeDeletedFilter}>
							Не засчитывать голоса удаленных пользователей.
						</Checkbox>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 2. Sex filter, sex Select */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox id='sexFilter' onChange={onChangeSexFilter}>
							Засчитывать только:
						</Checkbox>
						<FormItem>
							<Select
								placeholder='Женщин'	// doesn't do anything
								disabled={!sexFilter}
								value={sex}
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
						<Checkbox id='ageFilter' onChange={onChangeAgeFilter}>
							Засчитывать пользователей возрастом старше:
						</Checkbox>
						<FormItem>
							<Input
								id='age'
								value={age}
								type='number'
								disabled={!ageFilter}
								placeholder="18" after="лет"	// placeholder doesn't do anything
								onChange={onChangeAge}
							/>
						</FormItem>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 4. Bots and shady filter */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox>Не засчитывать страницы ботов и левые страницы.</Checkbox>
					</FormLayoutGroup>
				</Header>
				<Header>
					{/* 5. Groups filter, groups ChipsInput */}
					<FormLayoutGroup mode="horizontal">
						<Checkbox >Проверять на вступление в группу:</Checkbox>
						<FormItem>
							<ChipsInput
								placeholder="Название или ссылка"
								id='inputGroups'
								value={groups}
								onChange={onChangeGroup}
								onInputChange={() => console.log(groups)}
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
						<Checkbox>Засчитывать только пользователей из города(ов):</Checkbox>
						<FormItem>
							<ChipsInput
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
	go: PropTypes.func.isRequired,
	// deleted
	deletedFilter: PropTypes.bool.isRequired,
	onChangeDeletedFilter: PropTypes.func.isRequired,
	// sex
	sex: PropTypes.string.isRequired,
	onChangeSex: PropTypes.func.isRequired,
	sexFilter: PropTypes.bool.isRequired,
	onChangeSexFilter: PropTypes.func.isRequired,
	// age
	age: PropTypes.number.isRequired,
	onChangeAge: PropTypes.func.isRequired,
	ageFilter: PropTypes.bool.isRequired,
	onChangeAgeFilter: PropTypes.func.isRequired,
	// groups
	groups: PropTypes.array.isRequired,
	onChangeGroup: PropTypes.func.isRequired,
	onInputChangeGroup: PropTypes.func.isRequired,
	//city

	// func
	pollUrl: PropTypes.string.isRequired,
	setPollUrl: PropTypes.func.isRequired,
	handlePollUrlChange: PropTypes.func.isRequired
};

export default Home;
