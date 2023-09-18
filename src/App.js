import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Result from './panels/Result';
import List from './panels/List';
import moment from 'moment';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const access_token = window.access_token;

	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	// VK API lets you use 3 calls in 1 second. This is helper to avoid the issue
	function delay(ms) {
		return new Promise((resolve, reject) => {
		  setTimeout(resolve, ms);
		});
	  }

	// // Helper function
	// function getUrl(method, params) {
	// 	params = params || {};
	// 	params['access_token'] = access_token;
	// 	params['v'] = '5.131';
	// 	console.log('https://api.vk.com/method/' + method + '?' + $.param(params));
	// 	return 'https://api.vk.com/method/' + method + '?' + $.param(params);
	// }

	// // Вызывает API метод с параметрами, при удачном исполнении вызывает функцию `callback'
	// function sendRequest(method, params, callback) {
	// 	$.ajax({
	// 		url: getUrl(method, params),
	// 		method: 'GET',
	// 		dataType: 'JSONP',
	// 		success: callback
	// 	});
	// }

	/* Polls */
	const [pollResult, setPollResult] = useState(null);
	const [pollAnswersResult, setPollAnswersResult] = useState([]);
	const [uncountedList, setUncountedList] = useState([]);

	var currentPoll = null;
	var group2user = [];
	
	const [pollUrl, setPollUrl] = useState('');

	// reason for why vote was not counted
	const reasonStr = {
		'1': 'Удален или заблокирован',
		'2': 'Не подходит пол',
		'-2': 'Не указан пол',
		'3': 'Не подходит возраст',
		'-3': 'Не указан возраст',
		'4': 'Бот или левая страница',
		'5': 'Не состоит в группе',
		'6': 'Не подходит город'
	};

	function isApllicableUser(user) {
		if (deletedFilter) {
			if (Object.hasOwn(user, 'deactivated'))
				return 1;
		}

		if (sexFilter) {
			if (!Object.hasOwn(user, 'sex'))
				return -2;
			if (user.sex != sex)
				return 2;
		}

		if (ageFilter) {
			if (!Object.hasOwn(user, 'bdate'))
				return -3;

			const now = moment();
			const udate = moment(user.bdate, 'DD.MM.YYYY');
			if (!udate.isValid())
				return -3;
			if (now.diff(udate, 'years') < age)
				return 3;
		}

		if (botsFilter) {
			// TODO: проверка на ботов и левые страницы
			;
		}

		if (groupsFilter) {
			for (let i = 0; i < groups.length; i++) {
				let u = group2user[i].find( (g) => g.user_id === user.id);
				if (u === undefined)
					return -5;
				// console.log(u);
				if (u.member == 0)
					return 5;
			}
		}

		if (citiesFilter) {
			// TODO: проверка на город
			;
		}

		return 0;
	}

	async function mainHandlePoll(pollAnswers) {
		var voters = [];
		var votersFiltered = [];

		console.log(currentPoll);
		console.log(pollAnswers);

		if (pollAnswers == null) {
			console.log('GOT NO POLL RESULTS');
			return;
		}

		if (pollAnswers.length == 0) {
			console.log('GOT EMPTY POLL RESULTS');
			return;
		}

		console.log('GOT POLL RESULTS');
		console.log(pollAnswers);

		// Filter each voter, store info (link) of voters
		/* answer object = {
			answer_id: ID, 
			users: {
				count: COUNT,
				items: [...]
			}
		} */
		var users = [];
		var userIds = [];
		for (let ind = 0; ind < pollAnswers.length; ind++) {
			const pUsers = pollAnswers[ind].users;
			userIds = userIds.concat(pUsers.items);
			console.log(pUsers);

			// TODO: handle when `count' > `users.items.length'
			const data = await delay(334).then( () => {
				return bridge.send('VKWebAppCallAPIMethod', {
					method: 'users.get',
					params: {
						user_ids: pUsers.items.join(','),
						fields: 'screen_name,sex,bdate,country,city',
						access_token: access_token,
						v: 5.131
					}
				});
			});
			const _users = data.response;
			console.log(_users);
			users.push(_users);
		}
		console.log(users);
		console.log(userIds);

		// Group handling
		if (groupsFilter) {
			for (const group of groups) {
				var g2u = [];
				var from = 0;
				do {
					var to = from + 500;
					if (to > userIds.length) {
						to = userIds.length;
					}
					
					const data = await delay(334).then( () => {
						return bridge.send('VKWebAppCallAPIMethod', {
							method: 'groups.isMember',
							params: {
								group_id: group.gid,
								user_ids: userIds.slice(from, to).join(','),		// TODO: problem when more than 500 users
								access_token: access_token,
								v: 5.131
							}
						})
						.catch((error) => {
							console.log('GOT ERR');
							if (error.error_data.error_code == 203) {
								console.log('NO ACCESS, CONTINUE');
							} else {
								console.log(error);
							}
							return null;
						})
					});
					if (data == null) {
						break;
					}

					g2u = g2u.concat(data.response);

					from += 500;
				} while (from < userIds.length);
				group2user.push(g2u);
				console.log(group2user);
			}
		}


		for (let ind = 0; ind < users.length; ind++) {
			var v = [];
			var vf = [];
			for (const user of users[ind]) {
				var reason = isApllicableUser(user);
				if (reason == 0) {
					v.push({
						id: user.id,
						first_name: user.first_name,
						last_name: user.last_name,
						screen_name: user.screen_name
					});
				} else {
					vf.push({
						id: user.id,
						first_name: user.first_name,
						last_name: user.last_name,
						screen_name: user.screen_name,
						reason: reason
					});
				}
			}
			voters.push(v);
			votersFiltered.push(vf);
		}

		console.log('VOTERS:');
		console.log(voters);

		console.log('FILTERED VOTERS:');
		console.log(votersFiltered);

		// setVotersReact(voters.flat());
		// setVotersFilteredReact(votersFiltered.flat());

		var options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timezone: 'UTC',
			hour: 'numeric',
			minute: 'numeric',
		};
		
		var date = new Date().toLocaleString("ru", options);

		console.log('PollResult:');
		console.log({
			date: date,
			question: currentPoll.question,
			votes: currentPoll.votes,
			answers: currentPoll.answers,
			voters: voters,
			votersFiltered: votersFiltered
		});
		setPollResult({
			date: date,
			question: currentPoll.question,
			votes: currentPoll.votes,
			uncountedVotes: votersFiltered.flat().length,
			answers: currentPoll.answers,
			voters: voters,
			votersFiltered: votersFiltered
		});

		var answ = [];
		for (let i = 0; i < currentPoll.answers.length; i++) {
			answ.push({
				answer: currentPoll.answers[i],
				uncountedVotes: votersFiltered[i].length
			});
		};

		console.log('PollAnswerResult:');
		console.log(answ);
		setPollAnswersResult(answ);

		console.log('UncountedList:');
		console.log(votersFiltered);
		setUncountedList(votersFiltered);

		// добавить вывод на Result.js
	}

	const handlePoll = e => {
		if (pollUrl.match(/vk.com\/poll/)) {
			getPollId(pollUrl)
				.then( (pollAnswers) => mainHandlePoll(pollAnswers) );
		} else if (pollUrl.match(/vk.com\/wall/)) {
			getPollIdByWall(pollUrl)
				.then( (pollAnswers) => mainHandlePoll(pollAnswers) );
		} else {
			console.log('WRONG FORMAT');
			return;
		}
	}

	// Получить poll.id по ссылке формата https://vk.com/poll-206499155_886442433
	// TODO: polls.getVoters offset
	function getPollId(url) {
		// const regex = /poll(-\d+)_(\d+)/;
		const match = url.match(/poll(-?\d+)_(\d+)/);
		if (!match) {
			console.log('wrong format');
			return null;
		}
		const owner_id = match[1];
		const poll_id = match[2];

		var votes = -1;
		var answer_ids = [];

		return bridge.send('VKWebAppCallAPIMethod', {
			method: 'polls.getById',
			params: {
				owner_id: owner_id,
				poll_id: poll_id,
				access_token: access_token,
				v: 5.131
			}
		})
		.then((data) => {
			if (data.response) {
				const response = data.response;
				currentPoll = data.response;
				console.log('GOT POLL ID');
				console.log(response);

				// votes, answer_ids
				votes = response.votes;
				// answer_ids = response.answer_ids;
				for (let i = 0; i < response.answers.length; i++) {
					answer_ids.push(response.answers[i].id);
				}
				console.log(answer_ids);

				return bridge.send('VKWebAppCallAPIMethod', {
					method: 'polls.getVoters',
					params: {
						poll_id: poll_id,
						answer_ids: answer_ids.join(','),
						count: 1000,
						access_token: access_token,
						v: 5.131
					}
				});
			}
		})
		.then((data) => {
			if (data.response) {
				return data.response;
			}
		})
		.catch((error) => {
			console.log('GOT ERR');
			console.log(error);

			return null;
		})
	}

	// Получить poll.id по ссылке формата https://vk.com/wall-206499155_1548866
	// TODO: polls.getVoters offset
	function getPollIdByWall(url) {
		// const regex = /poll(-\d+)_(\d+)/;
		const match = url.match(/wall(-?\d+_\d+)/);
		if (!match) {
			console.log('wrong format');
			return;
		}
		const posts = match[1];

		var votes = -1;
		var answer_ids = [];

		return bridge.send('VKWebAppCallAPIMethod', {
			method: 'wall.getById',
			params: {
				posts: posts,
				access_token: access_token,
				v: 5.131
			}
		})
		.then((data) => {
			if (data.response) {
				const response = data.response[0];
				console.log('GOT WALL POSTS');
				console.log(response);

				if (response.attachments[0].type != 'poll') {
					console.log('NOT A POLL');
					return;
				}

				const poll = response.attachments[0].poll;
				console.log('GOT A POLL');
				console.log(poll);

				const poll_id = poll.id;
				// votes, answer_ids
				const votes = poll.votes;
				const answer_ids = [];
				// answer_ids = response.answer_ids;
				for (let i = 0; i < poll.answers.length; i++) {
					answer_ids.push(poll.answers[i].id);
				}
				console.log(answer_ids);

				return bridge.send('VKWebAppCallAPIMethod', {
					method: 'polls.getVoters',
					params: {
						poll_id: poll_id,
						answer_ids: answer_ids.join(','),
						access_token: access_token,
						v: 5.131
					}
				});
			}
		})
		.then((data) => {
			if (data.response) {
				return data.response;
			}
		})
		.catch((error) => {
			console.log('GOT ERR');
			console.log(error);

			return null;
		})
	}

	/* Options */
	const onChangeOption = e => {
		const option = e.target;

		switch (option.id) {
			case 'deletedFilter':
				setDeletedFilter(e.target.checked);
				break;
			case 'sexFilter':
				setSexFilter(e.target.checked);
				break;
			case 'ageFilter':
				setAgeFilter(e.target.checked);
				break;
			case 'botsFilter':
				setBotsFilter(e.target.checked);
				break;
			case 'groupsFilter':
				setGroupsFilter(e.target.checked);
				break;
			case 'citiesFilter':
				setCitiesFilter(e.target.checked);
				break;

			default:
				console.log('ERROR OPTION');
				break;
		}
	}

	const _chstates = e => {
		console.log('-----');

		console.log([
			deletedFilter,
			sexFilter,
			ageFilter,
			botsFilter,
			groupsFilter,
			citiesFilter
		]);

		console.log([
			sex,
			age,
			groups,
		]);

		console.log('-----');
	}
	/* 1. Deleted */
	const [deletedFilter, setDeletedFilter] = useState(false);

	/* 2. Sex */
	const [sex, setSex] = useState(1);
	const [sexFilter, setSexFilter] = useState(false);

	const onChangeSex = e => {
		setSex(Number(e.target.value));
	};

	/* 3. Age */
	const [age, setAge] = useState(18);
	const [ageFilter, setAgeFilter] = useState(false);

	const onChangeAge = e => {
		setAge( Math.max(1, Math.min(120, Number(e.target.value))) );
	};

	/* 4. Bots and shady users */
	const [botsFilter, setBotsFilter] = useState(false);

	/* 5. Groups */
	const [groups, setGroups] = useState([]);
	const [groupsFilter, setGroupsFilter] = useState(false);

	const onChangeGroup = e => {
		// `e' is {value, label} Optional[]
		console.log(e);
		if (groups.length < e.length) {
			const group = e[e.length - 1];

			// Search for a vk group and if successfully found, push it to `groups'
			bridge.send('VKWebAppCallAPIMethod', {
				method: 'groups.search',
				params: {
					q: group.value,
					access_token: access_token,
					v: 5.131
				}
			})
			.then((data) => {
				if (data.response) {
					console.log('-------');
					console.log(data);
					const response = data.response;
					if (response.count == 0) {
						return;
					}
					console.log(response);

					const g = response.items[0];
					const groupChip = { value: group.value, label: g.name, src: g.photo_100, gid: g.id };	// `gid' is vk group id
					console.log(groupChip);
					console.log(groups);
					// groups.push(groupChip);
					setGroups([].concat(groups, groupChip));
				}
			})
			.catch((error) => {
				console.log('GOT ERR (GROUPS)');
				console.log(error);
			})
		} else {
			setGroups(e);
		}
	};

	// TODO: При вводе названия, предлагать сообщества в выпадающем списке
	const onInputChangeGroup = e => {
		;
	};

	/* 6. Cities */
	// State для хранения результатов поиска городов
	const [citySearchResults, setCitySearchResults] = useState([]);
	const [citiesFilter, setCitiesFilter] = useState(false);

	// Функция для выполнения поиска городов с использованием VK API
	const searchCities = async (query) => {
		try {
			const response = await bridge.send('VKWebAppCallAPIMethod', {
				method: 'database.getCities',
				params: {
					country_id: 1, // Идентификатор страны (1 для России)
					q: query, // Поисковой запрос
					need_all: 1, // Флаг для возвращения полной информации о городах
					count: 10, // Количество результатов
					v: '5.131', // Версия API
				},
			});

			// Обработка результатов поиска
			if (response?.data?.response?.items) {
				setCitySearchResults(response.data.response.items.map((city) => city.title));
			}
		} catch (error) {
			console.error('Ошибка при выполнении запроса к VK API:', error);
		}
	};
	const [selectedCities, setSelectedCities] = useState([]);
	const [citySearchQuery, setCitySearchQuery] = useState('');

	// Обработчик изменений в ChipsInput для городов
	const onCityInputChange = (value) => {
		setCitySearchQuery(value);

		// Выполняем поиск городов при вводе текста
		if (value) {
			// Фильтруем результаты поиска городов на основе введенного текста
			const filteredCities = citySearchResults.filter((city) =>
				city.toLowerCase().includes(value.toLowerCase())
			);
			setCitySearchResults(filteredCities);
		} else {
			setCitySearchResults([]);
		}
	};

	// Обработчик выбора города из результатов поиска
	const onCitySelect = (cityTitle) => {
		setSelectedCities([...selectedCities, cityTitle]);
		setCitySearchQuery('');
		setCitySearchResults([]);
	};

	// Обработчик удаления города
	const removeCity = (cityTitle) => {
		const updatedCities = selectedCities.filter((city) => city !== cityTitle);
		setSelectedCities(updatedCities);
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home
									id='home' fetchedUser={fetchedUser} go={go}
									setPollUrl={setPollUrl} handlePoll={handlePoll}													// poll
									onChangeOption={onChangeOption}																	// handle all options changes
									_chstates={_chstates}																			// debug button
																																	// 1. deleted
									sexFilter={sexFilter} onChangeSex={onChangeSex}													// 2. sex
									age={age} ageFilter={ageFilter} onChangeAge={onChangeAge}										// 3. age
																																	// 4. bots and shady
									groups={groups} groupsFilter={groupsFilter} onChangeGroup={onChangeGroup}						// 5. groups
									citySearchResults={citySearchResults} removeCity={removeCity} searchCities={searchCities}		// 6. city
									selectedCities={selectedCities} citySearchQuery={citySearchQuery} onCitySelect={onCitySelect}	//
									onCityInputChange={onCityInputChange}															//
									citiesFilter={citiesFilter}																		//
								/>
								<Result id='result' go={go} poll={pollResult} answers={pollAnswersResult}/>
								<List id='list' go={go} poll={pollResult} list={uncountedList} reasons={reasonStr}/>
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
