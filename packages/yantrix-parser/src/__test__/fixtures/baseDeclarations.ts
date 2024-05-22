export const baseEmpty = {
	contextDescription: [],
	emit: [],
	subscribe: [],
};
export const baseContext = {
	contextDescription: [
		{
			context: [
				{
					KeyItemDeclaration: {
						TargetProperty: 'leftsideproperty',
					},
				},
			],
			payload: [
				{
					KeyItemDeclaration: {
						TargetProperty: 'rightsideproperty',
					},
				},
			],
		},
	],
};
export const baseContextWithPrevious = {
	contextDescription: [
		{
			context: [
				{
					KeyItemDeclaration: {
						TargetProperty: 'leftsideproperty',
					},
				},
			],
			prevContext: [
				{
					KeyItemDeclaration: {
						TargetProperty: 'rightsideproperty',
					},
				},
			],
		},
	],
};
export const baseSubscribe = {
	subscribe: [
		{
			event: 'event',
			action: {
				actionName: 'action',
			},
		},
	],
};

export const baseEmitEvent = {
	emit: [
		{
			eventName: 'eventName ',
			payload: [
				{
					KeyItemDeclaration: {
						TargetProperty: 'keylist',
					},
				},
			],
		},
	],
};
