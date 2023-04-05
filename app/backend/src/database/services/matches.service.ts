import IReturnService, { IID, IMatch, IQuery } from '../../interfaces';
import Matches from '../models/MatchesModel';
import Teams from '../models/TeamsModel';

export default class MatchesS {
  constructor(private model = Matches) {

  }

  async getAllMatches() {
    const data = await this.model.findAll({
      include: [
        { model: Teams, as: 'homeTeam', attributes: ['teamName'] },
        { model: Teams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return data;
  }

  async getFilteredMatches(query: IQuery): Promise<IReturnService> {
    const { inProgress } = query;
    if (!inProgress) {
      const data = await this.getAllMatches();
      return { status: 200, data };
    }
    const bol: boolean = JSON.parse(inProgress);
    const data = await this.model.findAll({
      include: [
        { model: Teams, as: 'homeTeam', attributes: ['teamName'] },
        { model: Teams, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: { inProgress: bol },
    });
    return { status: 200, data };
  }

  async patchMatch(params: IID): Promise<IReturnService> {
    const { id } = params;
    const match = await this.model.findByPk(id);
    if (match) {
      await match.update({
        inProgress: false,
      });
    }
    return { status: 200, message: 'Finished' };
  }

  async updateMatchGoals(params: IID): Promise<IReturnService> {
    const { id, homeTeamGoals, awayTeamGoals } = params;
    const match = await this.model.findByPk(id);
    if (match) {
      await match.update({
        homeTeamGoals,
        awayTeamGoals,
      });
    }
    return { status: 200, message: 'Goals updated with success' };
  }

  async createNewMatch(match: IMatch): Promise<IReturnService> {
    const data = await this.model.create({
      ...match,
    });
    return { status: 201, data };
  }
}
